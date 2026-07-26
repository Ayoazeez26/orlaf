import { Injectable } from "@nestjs/common"
import type {
  AdminAnalyticsOverview,
  AdminUserGrowthPoint,
  AnalyticsRangeKey,
} from "@sable/contracts"
import { Prisma } from "../generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"

const RANGE_DAYS: Record<AnalyticsRangeKey, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
}

type WindowBounds = {
  from: Date
  to: Date
}

/** Soft-deleted / rejected accounts are excluded from growth metrics. */
const EXCLUDED_STATUSES = ["deleted", "rejected"] as const

@Injectable()
export class AdminAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(
    rangeKey: AnalyticsRangeKey = "30d"
  ): Promise<AdminAnalyticsOverview> {
    const days = RANGE_DAYS[rangeKey]
    const to = new Date()
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
    const previous = {
      from: new Date(from.getTime() - days * 24 * 60 * 60 * 1000),
      to: from,
    }
    const current = { from, to }
    const grain = rangeKey === "7d" ? "day" : "week"

    const [
      newUsersCurrent,
      newUsersPrevious,
      newCreatorsCurrent,
      newCreatorsPrevious,
      userGrowth,
    ] = await Promise.all([
      this.countSignups("user", current),
      this.countSignups("user", previous),
      this.countSignups("creator", current),
      this.countSignups("creator", previous),
      this.buildUserGrowth(current, grain),
    ])

    return {
      range: {
        key: rangeKey,
        from: from.toISOString(),
        to: to.toISOString(),
      },
      kpis: {
        new_users: {
          value: newUsersCurrent,
          change_percent: this.changePercent(
            newUsersCurrent,
            newUsersPrevious
          ),
        },
        new_creators: {
          value: newCreatorsCurrent,
          change_percent: this.changePercent(
            newCreatorsCurrent,
            newCreatorsPrevious
          ),
        },
      },
      user_growth: userGrowth,
    }
  }

  private changePercent(current: number, previous: number): number | null {
    if (previous <= 0) return null
    return Number((((current - previous) / previous) * 100).toFixed(1))
  }

  private async countSignups(
    accountType: "user" | "creator",
    window: WindowBounds
  ): Promise<number> {
    return this.prisma.account.count({
      where: {
        accountType,
        status: { notIn: [...EXCLUDED_STATUSES] },
        createdAt: { gte: window.from, lt: window.to },
      },
    })
  }

  private async buildUserGrowth(
    window: WindowBounds,
    grain: "day" | "week"
  ): Promise<AdminUserGrowthPoint[]> {
    const truncSql = Prisma.raw(`'${grain}'`)
    const excluded = Prisma.join(
      EXCLUDED_STATUSES.map((status) => Prisma.sql`${status}`)
    )

    const rows = await this.prisma.$queryRaw<
      Array<{ bucket: Date; users: bigint; creators: bigint }>
    >`
      SELECT
        date_trunc(${truncSql}, created_at) AS bucket,
        COUNT(*) FILTER (WHERE account_type = 'user')::bigint AS users,
        COUNT(*) FILTER (WHERE account_type = 'creator')::bigint AS creators
      FROM accounts
      WHERE created_at >= ${window.from}
        AND created_at < ${window.to}
        AND account_type IN ('user', 'creator')
        AND status::text NOT IN (${excluded})
      GROUP BY 1
      ORDER BY 1 ASC
    `

    const byKey = new Map(
      rows.map((row) => [
        this.bucketKey(row.bucket, grain),
        {
          users: Number(row.users),
          creators: Number(row.creators),
        },
      ])
    )

    return this.enumerateBuckets(window, grain).map((bucket, index) => {
      const stats = byKey.get(bucket.key) ?? { users: 0, creators: 0 }
      return {
        bucket: bucket.key,
        label: this.bucketLabel(bucket.start, grain, index),
        users: stats.users,
        creators: stats.creators,
      }
    })
  }

  private enumerateBuckets(
    window: WindowBounds,
    grain: "day" | "week"
  ): Array<{ key: string; start: Date }> {
    const buckets: Array<{ key: string; start: Date }> = []
    const cursor = new Date(window.from)

    if (grain === "day") {
      cursor.setUTCHours(0, 0, 0, 0)
      while (cursor < window.to) {
        buckets.push({
          key: this.bucketKey(cursor, grain),
          start: new Date(cursor),
        })
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      }
      return buckets
    }

    const day = cursor.getUTCDay()
    const diff = (day + 6) % 7
    cursor.setUTCDate(cursor.getUTCDate() - diff)
    cursor.setUTCHours(0, 0, 0, 0)

    while (cursor < window.to) {
      buckets.push({
        key: this.bucketKey(cursor, grain),
        start: new Date(cursor),
      })
      cursor.setUTCDate(cursor.getUTCDate() + 7)
    }
    return buckets
  }

  private bucketKey(date: Date, grain: "day" | "week"): string {
    const d = new Date(date)
    if (grain === "day") {
      return d.toISOString().slice(0, 10)
    }
    const day = d.getUTCDay()
    const diff = (day + 6) % 7
    d.setUTCDate(d.getUTCDate() - diff)
    d.setUTCHours(0, 0, 0, 0)
    return d.toISOString().slice(0, 10)
  }

  private bucketLabel(
    start: Date,
    grain: "day" | "week",
    index: number
  ): string {
    if (grain === "day") {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        start.getUTCDay()
      ]!
    }
    return `W${index + 1}`
  }
}
