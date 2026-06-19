import { randomBytes, scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AccountType, AdminRole } from "@sable/contracts"
import { Account, AccountStatus } from "src/generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"

// TODO(KAN-53): import Sentry once OTEL is wired
// import * as Sentry from '@sentry/node';

const scryptAsync = promisify(scrypt)

// ---------------------------------------------------------------------------
// Allowed state transitions per account type
// ---------------------------------------------------------------------------

type Transition = { from: AccountStatus[]; to: AccountStatus }

const USER_TRANSITIONS: Transition[] = [
  { from: ["active"], to: "pending_deletion" },
  { from: ["pending_deletion"], to: "active" }, // restored within grace period
  { from: ["pending_deletion"], to: "deleted" }, // grace period elapsed
]

const CREATOR_TRANSITIONS: Transition[] = [
  { from: ["onboarding"], to: "pending_approval" },
  { from: ["pending_approval"], to: "active" },
  { from: ["pending_approval"], to: "rejected" },
  { from: ["active"], to: "suspended" },
  { from: ["active"], to: "pending_deletion" },
  { from: ["suspended"], to: "active" },
  { from: ["suspended"], to: "rejected" },
  { from: ["rejected"], to: "pending_approval" }, // re-application
  { from: ["pending_deletion"], to: "active" }, // restored within grace period
  { from: ["pending_deletion"], to: "deleted" },
]

const ADMIN_TRANSITIONS: Transition[] = [
  { from: ["active"], to: "suspended" },
  { from: ["suspended"], to: "active" },
]

const TRANSITIONS: Record<string, Transition[]> = {
  user: USER_TRANSITIONS,
  creator: CREATOR_TRANSITIONS,
  admin: ADMIN_TRANSITIONS,
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export interface CreateAdminInput {
  email: string
  role: AdminRole
  display_name?: string
}

export interface TransitionStatusInput {
  account_id: string
  to: AccountStatus
}

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  // ---------------------------------------------------------------------------
  // Create admin
  // ---------------------------------------------------------------------------

  /**
   * Creates an admin account with a random temp password.
   * must_change_password is set to true — the admin must change it on first login.
   * Called by super-admin flows only (KAN super-admin story).
   */
  async createAdmin(input: CreateAdminInput): Promise<Account> {
    const { email, display_name } = input
    const emailNormalized = this.normalizeEmail(email)

    // Check uniqueness within admin type
    const existing = await this.prisma.account.findUnique({
      where: {
        unique_email_per_account_type: {
          accountType: "admin",
          emailNormalized,
        },
      },
    })

    if (existing) {
      throw new ConflictException(`Admin account already exists for ${email}`)
    }

    // Generate random temp password — 16 bytes hex = 32 chars
    const tempPassword = randomBytes(16).toString("hex")
    const passwordHash = await this.hashPassword(tempPassword)

    try {
      const account = await this.prisma.account.create({
        data: {
          accountType: "admin",
          email,
          emailNormalized,
          passwordHash,
          mustChangePassword: true,
          displayName: display_name ?? null,
          status: "active",
        },
      })

      this.logger.log({
        event: "admin_account_created",
        account_id: account.id,
        email,
        // temp_password intentionally NOT logged
      })

      // TODO: email the temp password via the notification service (separate story)

      return account
    } catch (err) {
      this.logger.error({
        event: "admin_account_create_failed",
        email,
        error: (err as Error).message,
      })
      // TODO(KAN-53): Sentry.captureException(err);
      throw err
    }
  }

  // ---------------------------------------------------------------------------
  // Status transition
  // ---------------------------------------------------------------------------

  /**
   * The only permitted way to change an account's status.
   * Validates the transition is allowed for the account type before writing.
   */
  async transitionStatus(input: TransitionStatusInput): Promise<Account> {
    const { account_id, to } = input

    const account = await this.prisma.account.findUniqueOrThrow({
      where: { id: account_id },
    })

    this.assertTransitionAllowed(account?.accountType, account.status, to)

    const data: Partial<Account> = { status: to }

    if (to === "pending_deletion") {
      ;(data as any).deletedAt = new Date()
    }

    if (to === "active" && account.status === "pending_deletion") {
      // Restoration — clear the deletion timestamp
      ;(data as any).deletedAt = null
    }

    try {
      const updated = await this.prisma.account.update({
        where: { id: account_id },
        data,
      })

      this.logger.log({
        event: "account_status_transitioned",
        account_id,
        from: account.status,
        to,
        account_type: account.accountType,
      })

      return updated
    } catch (err) {
      this.logger.error({
        event: "account_status_transition_failed",
        account_id,
        to,
        error: (err as Error).message,
      })
      // TODO(KAN-53): Sentry.captureException(err);
      throw err
    }
  }

  // ---------------------------------------------------------------------------
  // Uniqueness helpers (used by sign-in flows)
  // ---------------------------------------------------------------------------

  async findByEmail(
    accountType: AccountType,
    email: string
  ): Promise<Account | null> {
    const emailNormalized = this.normalizeEmail(email)
    return this.prisma.account.findUnique({
      where: {
        unique_email_per_account_type: { accountType, emailNormalized },
      },
    })
  }

  async findByProvider(
    accountType: AccountType,
    provider: "google" | "apple",
    providerSubjectId: string
  ): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: {
        unique_provider_per_account_type: {
          accountType,
          provider,
          providerSubjectId,
        },
      },
    })
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  normalizeEmail(email: string): string {
    return email.trim().toLowerCase().normalize("NFC")
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex")
    const hash = (await scryptAsync(password, salt, 64)) as Buffer
    return `${salt}:${hash.toString("hex")}`
  }

  async verifyPassword(password: string, stored: string): Promise<boolean> {
    const [salt, storedHash] = stored.split(":")
    const hash = (await scryptAsync(password, salt, 64)) as Buffer
    const storedBuffer = Buffer.from(storedHash, "hex")
    return timingSafeEqual(hash, storedBuffer)
  }

  private assertTransitionAllowed(
    accountType: string,
    from: AccountStatus,
    to: AccountStatus
  ): void {
    const transitions = TRANSITIONS[accountType] ?? []
    const allowed = transitions.some(
      (t) => t.to === to && t.from.includes(from)
    )

    if (!allowed) {
      throw new BadRequestException(
        `Invalid status transition for ${accountType}: ${from} → ${to}`
      )
    }
  }
}
