import { randomBytes } from "node:crypto"
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import type {
  AdminApplicationChecklistStep,
  AdminApplicationDetail,
  AdminApplicationListItem,
  AdminApplicationListQuery,
  AdminApplicationListResponse,
  AdminApplicationStatus,
  AdminInviteListItem,
  AdminInviteListQuery,
  AdminInviteListResponse,
  AdminOnboardingStats,
} from "@sable/contracts"
import type { Prisma } from "src/generated/prisma/client"
import { AccountService } from "../auth/account.service"
import { EmailService } from "../email/email.service"
import { PrismaService } from "../prisma/prisma.service"
import type {
  CreateCreatorInviteDto,
  RejectApplicationDto,
} from "./dto/admin-onboarding.dto"

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000

const APPLICATION_SELECT = {
  id: true,
  email: true,
  displayName: true,
  firstName: true,
  lastName: true,
  bio: true,
  status: true,
  createdAt: true,
  onboardingReviewedAt: true,
  onboardingReviewNote: true,
  creatorProfile: { select: { handle: true } },
} satisfies Prisma.AccountSelect

type ApplicationRow = Prisma.AccountGetPayload<{
  select: typeof APPLICATION_SELECT
}>

const INVITE_INCLUDE = {
  invitedBy: { select: { displayName: true, email: true } },
} satisfies Prisma.CreatorInviteInclude

type InviteRow = Prisma.CreatorInviteGetPayload<{
  include: typeof INVITE_INCLUDE
}>

@Injectable()
export class AdminOnboardingService {
  private readonly logger = new Logger(AdminOnboardingService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountService,
    private readonly email: EmailService,
    private readonly config: ConfigService
  ) {}

  // ---------------------------------------------------------------------------
  // Applications
  // ---------------------------------------------------------------------------

  async listApplications(
    query: AdminApplicationListQuery
  ): Promise<AdminApplicationListResponse> {
    const page = Math.max(1, query.page ?? 1)
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20))
    const filter = query.filter ?? "all"
    const q = query.q?.trim()

    const where: Prisma.AccountWhereInput = {
      accountType: "creator",
      ...this.applicationStatusWhere(filter),
    }

    if (q) {
      where.OR = [
        { displayName: { contains: q, mode: "insensitive" } },
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { creatorProfile: { handle: { contains: q, mode: "insensitive" } } },
      ]
    }

    const [rows, total, stats] = await Promise.all([
      this.prisma.account.findMany({
        where,
        select: APPLICATION_SELECT,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.account.count({ where }),
      this.computeStats(),
    ])

    return {
      items: rows.map((row) => this.toApplicationItem(row)),
      total,
      page,
      pageSize,
      stats,
    }
  }

  async getApplication(id: string): Promise<AdminApplicationDetail> {
    const row = await this.findApplicationRow(id)
    const item = this.toApplicationItem(row)

    return {
      ...item,
      bio: row.bio,
      reviewedAt: row.onboardingReviewedAt?.toISOString() ?? null,
      reviewNote: row.onboardingReviewNote,
      checklist: this.buildChecklist(row),
    }
  }

  async approve(id: string, adminId: string): Promise<AdminApplicationDetail> {
    await this.findApplicationRow(id)

    await this.accountService.transitionStatus({
      account_id: id,
      to: "active",
    })
    await this.prisma.account.update({
      where: { id },
      data: {
        onboardingReviewedAt: new Date(),
        onboardingReviewedById: adminId,
        onboardingReviewNote: null,
      },
    })

    this.logger.log({
      event: "application_approved",
      account_id: id,
      admin_id: adminId,
    })
    return this.getApplication(id)
  }

  async reject(
    id: string,
    adminId: string,
    input: RejectApplicationDto
  ): Promise<AdminApplicationDetail> {
    await this.findApplicationRow(id)

    await this.accountService.transitionStatus({
      account_id: id,
      to: "rejected",
    })
    await this.prisma.account.update({
      where: { id },
      data: {
        onboardingReviewedAt: new Date(),
        onboardingReviewedById: adminId,
        onboardingReviewNote: input.note ?? null,
      },
    })

    this.logger.log({
      event: "application_rejected",
      account_id: id,
      admin_id: adminId,
    })
    return this.getApplication(id)
  }

  async reopen(id: string, adminId: string): Promise<AdminApplicationDetail> {
    await this.findApplicationRow(id)

    await this.accountService.transitionStatus({
      account_id: id,
      to: "pending_approval",
    })
    await this.prisma.account.update({
      where: { id },
      data: {
        onboardingReviewedAt: null,
        onboardingReviewedById: null,
        onboardingReviewNote: null,
      },
    })

    this.logger.log({
      event: "application_reopened",
      account_id: id,
      admin_id: adminId,
    })
    return this.getApplication(id)
  }

  // ---------------------------------------------------------------------------
  // Invites
  // ---------------------------------------------------------------------------

  async listInvites(
    query: AdminInviteListQuery
  ): Promise<AdminInviteListResponse> {
    const page = Math.max(1, query.page ?? 1)
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20))
    const filter = query.filter ?? "all"
    const q = query.q?.trim()

    const where: Prisma.CreatorInviteWhereInput = {}
    if (filter !== "all") where.status = filter
    if (q) where.email = { contains: q, mode: "insensitive" }

    const [rows, total, stats] = await Promise.all([
      this.prisma.creatorInvite.findMany({
        where,
        include: INVITE_INCLUDE,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.creatorInvite.count({ where }),
      this.computeStats(),
    ])

    return {
      items: rows.map((row) => this.toInviteItem(row)),
      total,
      page,
      pageSize,
      stats,
    }
  }

  async createInvite(
    adminId: string,
    input: CreateCreatorInviteDto
  ): Promise<AdminInviteListItem> {
    const emailNormalized = this.normalizeEmail(input.email)

    const existingCreator = await this.prisma.account.findUnique({
      where: {
        unique_email_per_account_type: {
          accountType: "creator",
          emailNormalized,
        },
      },
      select: { id: true },
    })
    if (existingCreator) {
      throw new ConflictException(
        "A creator account already exists for this email."
      )
    }

    const activeInvite = await this.prisma.creatorInvite.findFirst({
      where: {
        emailNormalized,
        status: "sent",
        expiresAt: { gt: new Date() },
      },
    })
    if (activeInvite) {
      throw new ConflictException(
        "An active invite already exists for this email."
      )
    }

    const invite = await this.prisma.creatorInvite.create({
      data: {
        email: input.email.trim(),
        emailNormalized,
        firstName: input.firstName?.trim() || null,
        lastName: input.lastName?.trim() || null,
        note: input.note?.trim() || null,
        token: this.generateToken(),
        status: "sent",
        invitedById: adminId,
        expiresAt: new Date(Date.now() + INVITE_TTL_MS),
      },
      include: INVITE_INCLUDE,
    })

    await this.sendInviteEmail(invite)
    this.logger.log({
      event: "creator_invite_created",
      invite_id: invite.id,
      admin_id: adminId,
    })

    return this.toInviteItem(invite)
  }

  async resendInvite(id: string): Promise<AdminInviteListItem> {
    const invite = await this.prisma.creatorInvite.findUnique({ where: { id } })
    if (!invite) throw new NotFoundException("Invite not found.")

    if (invite.status === "accepted" || invite.status === "revoked") {
      throw new ConflictException(`Cannot resend a ${invite.status} invite.`)
    }

    const updated = await this.prisma.creatorInvite.update({
      where: { id },
      data: {
        token: this.generateToken(),
        status: "sent",
        expiresAt: new Date(Date.now() + INVITE_TTL_MS),
      },
      include: INVITE_INCLUDE,
    })

    await this.sendInviteEmail(updated)
    this.logger.log({ event: "creator_invite_resent", invite_id: id })

    return this.toInviteItem(updated)
  }

  async revokeInvite(id: string): Promise<AdminInviteListItem> {
    const invite = await this.prisma.creatorInvite.findUnique({ where: { id } })
    if (!invite) throw new NotFoundException("Invite not found.")

    const updated = await this.prisma.creatorInvite.update({
      where: { id },
      data: { status: "revoked" },
      include: INVITE_INCLUDE,
    })

    this.logger.log({ event: "creator_invite_revoked", invite_id: id })
    return this.toInviteItem(updated)
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private applicationStatusWhere(
    filter: NonNullable<AdminApplicationListQuery["filter"]>
  ): Prisma.AccountWhereInput {
    switch (filter) {
      case "pending":
        return { status: "pending_approval" }
      case "rejected":
        return { status: "rejected" }
      case "approved":
        return { status: "active", onboardingReviewedAt: { not: null } }
      default:
        return {
          OR: [
            { status: "pending_approval" },
            { status: "rejected" },
            { status: "active", onboardingReviewedAt: { not: null } },
          ],
        }
    }
  }

  private async computeStats(): Promise<AdminOnboardingStats> {
    const [pending, approved, rejected, invited] = await Promise.all([
      this.prisma.account.count({
        where: { accountType: "creator", status: "pending_approval" },
      }),
      this.prisma.account.count({
        where: {
          accountType: "creator",
          status: "active",
          onboardingReviewedAt: { not: null },
        },
      }),
      this.prisma.account.count({
        where: { accountType: "creator", status: "rejected" },
      }),
      this.prisma.creatorInvite.count({ where: { status: "sent" } }),
    ])

    return { pending, invited, approved, rejected }
  }

  private async findApplicationRow(id: string): Promise<ApplicationRow> {
    const row = await this.prisma.account.findUnique({
      where: { id },
      select: { ...APPLICATION_SELECT, accountType: true },
    })

    if (row?.accountType !== "creator") {
      throw new NotFoundException("Application not found.")
    }

    return row
  }

  private toApplicationItem(row: ApplicationRow): AdminApplicationListItem {
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
      source: "Application",
      submittedAt: row.createdAt.toISOString(),
      status: toApplicationStatus(row),
    }
  }

  private buildChecklist(row: ApplicationRow): AdminApplicationChecklistStep[] {
    const reviewed = row.onboardingReviewedAt !== null
    return [
      { id: "submitted", label: "Application submitted", completed: true },
      { id: "reviewed", label: "Reviewed by admin", completed: reviewed },
      {
        id: "active",
        label: "Creator account active",
        completed: row.status === "active",
      },
    ]
  }

  private toInviteItem(row: InviteRow): AdminInviteListItem {
    return {
      id: row.id,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      status: row.status,
      sentBy: row.invitedBy.displayName ?? row.invitedBy.email,
      sentAt: row.updatedAt.toISOString(),
      expiresAt: row.expiresAt.toISOString(),
    }
  }

  private async sendInviteEmail(invite: InviteRow): Promise<void> {
    const base =
      this.config.get<string>("CREATOR_WEB_URL") ??
      this.config.get<string>("APP_URL") ??
      "http://localhost:3001"
    const acceptUrl = `${base.replace(/\/$/, "")}/onboarding?invite=${invite.token}`

    // Email delivery is best-effort: a provider failure must not prevent the
    // invite from being created/updated (it can be resent later).
    try {
      await this.email.sendCreatorInvite({
        to: invite.email,
        firstName: invite.firstName,
        note: invite.note,
        acceptUrl,
      })
    } catch (err) {
      this.logger.error({
        event: "creator_invite_email_failed",
        invite_id: invite.id,
        error: (err as Error).message,
      })
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase().normalize("NFC")
  }

  private generateToken(): string {
    return randomBytes(32).toString("hex")
  }
}

function stripLeadingAt(value: string): string {
  return value.replace(/^@+/, "").trim()
}

function buildName(row: ApplicationRow): string {
  const full = [row.firstName, row.lastName].filter(Boolean).join(" ").trim()
  if (full) return full
  if (row.displayName?.trim()) return stripLeadingAt(row.displayName)
  return row.email.split("@")[0] ?? row.email
}

function buildInitials(row: ApplicationRow, name: string): string {
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

function toApplicationStatus(row: ApplicationRow): AdminApplicationStatus {
  if (row.status === "rejected") return "rejected"
  if (row.status === "active" && row.onboardingReviewedAt) return "approved"
  return "pending"
}
