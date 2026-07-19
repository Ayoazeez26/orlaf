import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import type {
  AdminCreatorDetail,
  AdminCreatorListItem,
  AdminCreatorListQuery,
  AdminCreatorListResponse,
  AdminCreatorStats,
  AdminCreatorStatus,
  AdminSuspendDuration,
} from "@sable/contracts"
import type { Prisma } from "src/generated/prisma/client"
import { AccountService } from "../auth/account.service"
import { PrismaService } from "../prisma/prisma.service"
import type {
  SuspendCreatorDto,
  VerifyCreatorDto,
} from "./dto/admin-creators.dto"

const CREATOR_SELECT = {
  id: true,
  email: true,
  displayName: true,
  firstName: true,
  lastName: true,
  bio: true,
  status: true,
  createdAt: true,
  suspendedAt: true,
  suspendedUntil: true,
  suspendReason: true,
  creatorProfile: {
    select: {
      handle: true,
      studioName: true,
      creatorType: true,
      isVerified: true,
      verifiedAt: true,
    },
  },
} satisfies Prisma.AccountSelect

type CreatorRow = Prisma.AccountGetPayload<{ select: typeof CREATOR_SELECT }>

const SUSPEND_DURATION_MS: Record<
  Exclude<AdminSuspendDuration, "permanent">,
  number
> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
}

@Injectable()
export class AdminCreatorsService {
  private readonly logger = new Logger(AdminCreatorsService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountService
  ) {}

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  async list(query: AdminCreatorListQuery): Promise<AdminCreatorListResponse> {
    const page = Math.max(1, query.page ?? 1)
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20))
    const filter = query.filter ?? "all"
    const q = query.q?.trim()

    const where: Prisma.AccountWhereInput = {
      accountType: "creator",
      status: { in: ["active", "suspended"] },
    }

    if (filter === "active") where.status = "active"
    if (filter === "suspended") where.status = "suspended"
    if (filter === "new") where.createdAt = { gte: startOfMonth() }

    if (q) {
      where.OR = [
        { displayName: { contains: q, mode: "insensitive" } },
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        {
          creatorProfile: {
            handle: { contains: q, mode: "insensitive" },
          },
        },
      ]
    }

    const [rows, total, stats] = await Promise.all([
      this.prisma.account.findMany({
        where,
        select: CREATOR_SELECT,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.account.count({ where }),
      this.computeStats(),
    ])

    return {
      items: rows.map((row) => this.toListItem(row)),
      total,
      page,
      pageSize,
      stats,
    }
  }

  private async computeStats(): Promise<AdminCreatorStats> {
    const base: Prisma.AccountWhereInput = {
      accountType: "creator",
      status: { in: ["active", "suspended"] },
    }

    const [total, active, suspended, newThisMonth] = await Promise.all([
      this.prisma.account.count({ where: base }),
      this.prisma.account.count({
        where: { ...base, status: "active" },
      }),
      this.prisma.account.count({
        where: { ...base, status: "suspended" },
      }),
      this.prisma.account.count({
        where: { ...base, createdAt: { gte: startOfMonth() } },
      }),
    ])

    return { total, active, suspended, newThisMonth }
  }

  // ---------------------------------------------------------------------------
  // Detail
  // ---------------------------------------------------------------------------

  async getById(id: string): Promise<AdminCreatorDetail> {
    const row = await this.findCreatorRow(id)
    const base = this.toListItem(row)

    return {
      ...base,
      bio: row.bio,
      handle: row.creatorProfile?.handle ?? null,
      studioName: row.creatorProfile?.studioName ?? null,
      creatorType: row.creatorProfile?.creatorType ?? null,
      verifiedAt: row.creatorProfile?.verifiedAt?.toISOString() ?? null,
      suspendedAt: row.suspendedAt?.toISOString() ?? null,
      suspendedUntil: row.suspendedUntil?.toISOString() ?? null,
      suspendReason: row.suspendReason,
    }
  }

  // ---------------------------------------------------------------------------
  // Verify / unverify
  // ---------------------------------------------------------------------------

  async verify(
    id: string,
    adminId: string,
    input: VerifyCreatorDto
  ): Promise<AdminCreatorDetail> {
    await this.findCreatorRow(id)

    await this.prisma.creatorProfile.upsert({
      where: { accountId: id },
      create: {
        accountId: id,
        isVerified: true,
        verifiedAt: new Date(),
        verifiedById: adminId,
      },
      update: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedById: adminId,
      },
    })

    this.logger.log({
      event: "creator_verified",
      account_id: id,
      admin_id: adminId,
      note: input.note ?? null,
    })

    return this.getById(id)
  }

  async unverify(id: string, adminId: string): Promise<AdminCreatorDetail> {
    await this.findCreatorRow(id)

    await this.prisma.creatorProfile.upsert({
      where: { accountId: id },
      create: { accountId: id, isVerified: false },
      update: { isVerified: false, verifiedAt: null, verifiedById: null },
    })

    this.logger.log({
      event: "creator_unverified",
      account_id: id,
      admin_id: adminId,
    })

    return this.getById(id)
  }

  // ---------------------------------------------------------------------------
  // Suspend / reactivate
  // ---------------------------------------------------------------------------

  async suspend(
    id: string,
    adminId: string,
    input: SuspendCreatorDto
  ): Promise<AdminCreatorDetail> {
    await this.findCreatorRow(id)

    await this.accountService.transitionStatus({
      account_id: id,
      to: "suspended",
    })

    const suspendedUntil =
      input.duration === "permanent"
        ? null
        : new Date(Date.now() + SUSPEND_DURATION_MS[input.duration])

    await this.prisma.account.update({
      where: { id },
      data: {
        suspendedAt: new Date(),
        suspendedUntil,
        suspendReason: input.reason ?? null,
        suspendedById: adminId,
      },
    })

    this.logger.log({
      event: "creator_suspended",
      account_id: id,
      admin_id: adminId,
      duration: input.duration,
    })

    return this.getById(id)
  }

  async reactivate(id: string, adminId: string): Promise<AdminCreatorDetail> {
    await this.findCreatorRow(id)

    await this.accountService.transitionStatus({
      account_id: id,
      to: "active",
    })

    await this.prisma.account.update({
      where: { id },
      data: {
        suspendedAt: null,
        suspendedUntil: null,
        suspendReason: null,
        suspendedById: null,
      },
    })

    this.logger.log({
      event: "creator_reactivated",
      account_id: id,
      admin_id: adminId,
    })

    return this.getById(id)
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private async findCreatorRow(id: string): Promise<CreatorRow> {
    const row = await this.prisma.account.findUnique({
      where: { id },
      select: { ...CREATOR_SELECT, accountType: true },
    })

    if (row?.accountType !== "creator") {
      throw new NotFoundException("Creator not found.")
    }

    return row
  }

  private toListItem(row: CreatorRow): AdminCreatorListItem {
    const name = buildName(row)

    return {
      id: row.id,
      name,
      email: row.email,
      username: row.creatorProfile?.handle
        ? `@${row.creatorProfile.handle}`
        : "",
      initials: buildInitials(row, name),
      location: "",
      views: 0,
      earnings: 0,
      status: toCreatorStatus(row.status),
      isVerified: row.creatorProfile?.isVerified ?? false,
      isNew: row.createdAt >= startOfMonth(),
      joinedAt: row.createdAt.toISOString(),
    }
  }
}

function startOfMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

function stripLeadingAt(value: string): string {
  return value.replace(/^@+/, "").trim()
}

function buildName(row: CreatorRow): string {
  const full = [row.firstName, row.lastName].filter(Boolean).join(" ").trim()
  if (full) return full
  if (row.displayName?.trim()) return stripLeadingAt(row.displayName)
  return row.email.split("@")[0] ?? row.email
}

function buildInitials(row: CreatorRow, name: string): string {
  const first = row.firstName?.trim()
  const last = row.lastName?.trim()
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase()

  const source = stripLeadingAt(name) || row.email
  const parts = source.split(/[\s._-]+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

function toCreatorStatus(status: string): AdminCreatorStatus {
  return status === "suspended" ? "suspended" : "active"
}
