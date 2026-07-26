import { Injectable } from "@nestjs/common"
import type {
  AnalyticsDeviceSegment,
  AnalyticsEngagementPoint,
  AnalyticsRangeKey,
  AnalyticsTopEpisode,
  AnalyticsTrendPoint,
  CreatorAnalyticsOverview,
} from "@sable/contracts"
import { Prisma } from "../generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"

const RANGE_DAYS: Record<AnalyticsRangeKey, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
}

const DEVICE_ORDER = ["mobile", "desktop", "tablet", "tv"] as const
const DEVICE_LABEL: Record<(typeof DEVICE_ORDER)[number], AnalyticsDeviceSegment["name"]> =
  {
    mobile: "Mobile",
    desktop: "Desktop",
    tablet: "Tablet",
    tv: "TV",
  }

type WindowBounds = {
  from: Date
  to: Date
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(
    creatorId: string,
    rangeKey: AnalyticsRangeKey = "30d"
  ): Promise<CreatorAnalyticsOverview> {
    const days = RANGE_DAYS[rangeKey]
    const to = new Date()
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
    const prevTo = from
    const prevFrom = new Date(from.getTime() - days * 24 * 60 * 60 * 1000)
    const grain = rangeKey === "7d" ? "day" : "week"

    const current = { from, to }
    const previous = { from: prevFrom, to: prevTo }

    const [
      currentViews,
      previousViews,
      currentUniques,
      previousUniques,
      currentWatch,
      previousWatch,
      currentEngagement,
      previousEngagement,
      viewershipTrend,
      devices,
      engagement,
      topEpisodes,
    ] = await Promise.all([
      this.countViews(creatorId, current),
      this.countViews(creatorId, previous),
      this.countUniques(creatorId, current),
      this.countUniques(creatorId, previous),
      this.sumWatchedSeconds(creatorId, current),
      this.sumWatchedSeconds(creatorId, previous),
      this.countEngagementActions(creatorId, current),
      this.countEngagementActions(creatorId, previous),
      this.buildViewershipTrend(creatorId, current, grain),
      this.buildDevices(creatorId, current),
      this.buildEngagement(creatorId, current, grain),
      this.buildTopEpisodes(creatorId, current, previous),
    ])

    const avgWatchCurrent =
      currentViews > 0 ? currentWatch / currentViews : 0
    const avgWatchPrevious =
      previousViews > 0 ? previousWatch / previousViews : 0

    const engagementRateCurrent =
      currentViews > 0 ? currentEngagement / currentViews : 0
    const engagementRatePrevious =
      previousViews > 0 ? previousEngagement / previousViews : 0

    return {
      range: {
        key: rangeKey,
        from: from.toISOString(),
        to: to.toISOString(),
      },
      kpis: {
        total_views: {
          value: currentViews,
          change_percent: this.changePercent(currentViews, previousViews),
        },
        unique_viewers: {
          value: currentUniques,
          change_percent: this.changePercent(currentUniques, previousUniques),
        },
        avg_watch_seconds: {
          value: Math.round(avgWatchCurrent),
          change_percent: this.changePercent(avgWatchCurrent, avgWatchPrevious),
        },
        engagement_rate: {
          value: engagementRateCurrent,
          change_percent: this.changePercent(
            engagementRateCurrent,
            engagementRatePrevious
          ),
        },
      },
      viewership_trend: viewershipTrend,
      devices,
      engagement,
      top_episodes: topEpisodes,
    }
  }

  private changePercent(current: number, previous: number): number | null {
    if (previous <= 0) return null
    return Number((((current - previous) / previous) * 100).toFixed(1))
  }

  private async countViews(
    creatorId: string,
    window: WindowBounds
  ): Promise<number> {
    return this.prisma.playbackSession.count({
      where: {
        creatorId,
        countedAsView: true,
        startedAt: { gte: window.from, lt: window.to },
      },
    })
  }

  private async countUniques(
    creatorId: string,
    window: WindowBounds
  ): Promise<number> {
    const rows = await this.prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(DISTINCT COALESCE(account_id, anon_id))::bigint AS count
      FROM playback_sessions
      WHERE creator_id = ${creatorId}
        AND counted_as_view = true
        AND started_at >= ${window.from}
        AND started_at < ${window.to}
        AND COALESCE(account_id, anon_id) IS NOT NULL
    `
    return Number(rows[0]?.count ?? 0)
  }

  private async sumWatchedSeconds(
    creatorId: string,
    window: WindowBounds
  ): Promise<number> {
    const result = await this.prisma.playbackSession.aggregate({
      where: {
        creatorId,
        countedAsView: true,
        startedAt: { gte: window.from, lt: window.to },
      },
      _sum: { watchedSeconds: true },
    })
    return result._sum.watchedSeconds ?? 0
  }

  private async countEngagementActions(
    creatorId: string,
    window: WindowBounds
  ): Promise<number> {
    const seriesFilter = { creatorId }
    const [likes, comments, shares] = await Promise.all([
      this.prisma.seriesLike.count({
        where: {
          createdAt: { gte: window.from, lt: window.to },
          series: seriesFilter,
        },
      }),
      this.prisma.comment.count({
        where: {
          createdAt: { gte: window.from, lt: window.to },
          deletedAt: null,
          series: seriesFilter,
        },
      }),
      this.prisma.shareEvent.count({
        where: {
          createdAt: { gte: window.from, lt: window.to },
          series: seriesFilter,
        },
      }),
    ])
    return likes + comments + shares
  }

  private async buildViewershipTrend(
    creatorId: string,
    window: WindowBounds,
    grain: "day" | "week"
  ): Promise<AnalyticsTrendPoint[]> {
    const truncSql = Prisma.raw(`'${grain}'`)
    const rows = await this.prisma.$queryRaw<
      Array<{ bucket: Date; views: bigint; unique_viewers: bigint }>
    >`
      SELECT
        date_trunc(${truncSql}, started_at) AS bucket,
        COUNT(*)::bigint AS views,
        COUNT(DISTINCT COALESCE(account_id, anon_id))::bigint AS unique_viewers
      FROM playback_sessions
      WHERE creator_id = ${creatorId}
        AND counted_as_view = true
        AND started_at >= ${window.from}
        AND started_at < ${window.to}
      GROUP BY 1
      ORDER BY 1 ASC
    `

    return this.fillTrendBuckets(window, grain, rows)
  }

  private fillTrendBuckets(
    window: WindowBounds,
    grain: "day" | "week",
    rows: Array<{ bucket: Date; views: bigint; unique_viewers: bigint }>
  ): AnalyticsTrendPoint[] {
    const byKey = new Map(
      rows.map((row) => [
        this.bucketKey(row.bucket, grain),
        {
          views: Number(row.views),
          unique: Number(row.unique_viewers),
        },
      ])
    )

    const buckets = this.enumerateBuckets(window, grain)
    return buckets.map((bucket, index) => {
      const stats = byKey.get(bucket.key) ?? { views: 0, unique: 0 }
      return {
        bucket: bucket.key,
        label: this.bucketLabel(bucket.start, grain, index),
        views: stats.views,
        unique: stats.unique,
      }
    })
  }

  private async buildDevices(
    creatorId: string,
    window: WindowBounds
  ): Promise<AnalyticsDeviceSegment[]> {
    const grouped = await this.prisma.playbackSession.groupBy({
      by: ["deviceType"],
      where: {
        creatorId,
        countedAsView: true,
        startedAt: { gte: window.from, lt: window.to },
      },
      _count: { _all: true },
    })

    const counts = new Map(
      grouped
        .filter((row) => typeof row.deviceType === "string")
        .map((row) => [row.deviceType.toLowerCase(), row._count._all])
    )
    const total = [...counts.values()].reduce((sum, n) => sum + n, 0)

    return DEVICE_ORDER.filter((key) => key !== "tv")
      .map((key) => {
        const value = counts.get(key) ?? 0
        return {
          name: DEVICE_LABEL[key],
          value,
          percent: total > 0 ? Math.round((value / total) * 100) : 0,
        }
      })
  }

  private async buildEngagement(
    creatorId: string,
    window: WindowBounds,
    grain: "day" | "week"
  ): Promise<AnalyticsEngagementPoint[]> {
    const truncSql = Prisma.raw(`'${grain}'`)

    const [viewRows, likeRows, shareRows] = await Promise.all([
      this.prisma.$queryRaw<Array<{ bucket: Date; count: bigint }>>`
        SELECT date_trunc(${truncSql}, started_at) AS bucket,
               COUNT(*)::bigint AS count
        FROM playback_sessions
        WHERE creator_id = ${creatorId}
          AND counted_as_view = true
          AND started_at >= ${window.from}
          AND started_at < ${window.to}
        GROUP BY 1
      `,
      this.prisma.$queryRaw<Array<{ bucket: Date; count: bigint }>>`
        SELECT date_trunc(${truncSql}, sl.created_at) AS bucket,
               COUNT(*)::bigint AS count
        FROM series_likes sl
        INNER JOIN series s ON s.id = sl.series_id
        WHERE s.creator_id = ${creatorId}
          AND sl.created_at >= ${window.from}
          AND sl.created_at < ${window.to}
        GROUP BY 1
      `,
      this.prisma.$queryRaw<Array<{ bucket: Date; count: bigint }>>`
        SELECT date_trunc(${truncSql}, se.created_at) AS bucket,
               COUNT(*)::bigint AS count
        FROM share_events se
        INNER JOIN series s ON s.id = se.series_id
        WHERE s.creator_id = ${creatorId}
          AND se.created_at >= ${window.from}
          AND se.created_at < ${window.to}
        GROUP BY 1
      `,
    ])

    const viewsMap = new Map(
      viewRows.map((r) => [this.bucketKey(r.bucket, grain), Number(r.count)])
    )
    const likesMap = new Map(
      likeRows.map((r) => [this.bucketKey(r.bucket, grain), Number(r.count)])
    )
    const sharesMap = new Map(
      shareRows.map((r) => [this.bucketKey(r.bucket, grain), Number(r.count)])
    )

    return this.enumerateBuckets(window, grain).map((bucket, index) => ({
      bucket: bucket.key,
      label: this.bucketLabel(bucket.start, grain, index),
      views: viewsMap.get(bucket.key) ?? 0,
      likes: likesMap.get(bucket.key) ?? 0,
      shares: sharesMap.get(bucket.key) ?? 0,
    }))
  }

  private async buildTopEpisodes(
    creatorId: string,
    current: WindowBounds,
    previous: WindowBounds
  ): Promise<AnalyticsTopEpisode[]> {
    const currentRows = await this.prisma.playbackSession.groupBy({
      by: ["episodeId"],
      where: {
        creatorId,
        countedAsView: true,
        startedAt: { gte: current.from, lt: current.to },
      },
      _count: { _all: true },
    })

    const ranked = [...currentRows]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 5)

    if (ranked.length === 0) return []

    const episodeIds = ranked.map((row) => row.episodeId)
    const [episodes, previousRows] = await Promise.all([
      this.prisma.episode.findMany({
        where: { id: { in: episodeIds } },
        select: {
          id: true,
          title: true,
          seriesId: true,
          series: { select: { title: true } },
        },
      }),
      this.prisma.playbackSession.groupBy({
        by: ["episodeId"],
        where: {
          creatorId,
          countedAsView: true,
          episodeId: { in: episodeIds },
          startedAt: { gte: previous.from, lt: previous.to },
        },
        _count: { _all: true },
      }),
    ])

    const episodeById = new Map(episodes.map((ep) => [ep.id, ep]))
    const prevById = new Map(
      previousRows.map((row) => [row.episodeId, row._count._all])
    )

    return ranked.map((row, index) => {
      const episode = episodeById.get(row.episodeId)
      const views = row._count._all
      const prevViews = prevById.get(row.episodeId) ?? 0
      return {
        rank: index + 1,
        episode_id: row.episodeId,
        episode_title: episode?.title ?? "Untitled",
        series_id: episode?.seriesId ?? "",
        series_title: episode?.series.title ?? "Untitled",
        views,
        change_percent: this.changePercent(views, prevViews),
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
        buckets.push({ key: this.bucketKey(cursor, grain), start: new Date(cursor) })
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      }
      return buckets
    }

    // Align to Monday UTC week start
    const day = cursor.getUTCDay()
    const diff = (day + 6) % 7
    cursor.setUTCDate(cursor.getUTCDate() - diff)
    cursor.setUTCHours(0, 0, 0, 0)

    while (cursor < window.to) {
      buckets.push({ key: this.bucketKey(cursor, grain), start: new Date(cursor) })
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
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][start.getUTCDay()]!
    }
    return `W${index + 1}`
  }
}
