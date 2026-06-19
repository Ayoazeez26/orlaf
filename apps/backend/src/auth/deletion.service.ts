import { BadRequestException, Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Cron, CronExpression } from "@nestjs/schedule"
import { AccountType } from "@sable/contracts"
import { Account } from "src/generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { RefreshTokenService } from "./refresh-token.service"

// TODO(KAN-53): import Sentry once OTEL is wired
// import * as Sentry from '@sentry/node';

const GRACE_PERIOD_DAYS = 30

@Injectable()
export class DeletionService {
  private readonly logger = new Logger(DeletionService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly config: ConfigService
  ) {}

  // ---------------------------------------------------------------------------
  // POST /auth/account/delete
  // ---------------------------------------------------------------------------

  /**
   * Initiates account deletion for a mobile user.
   * - Rejects creator and admin tokens with 400.
   * - Sets status to pending_deletion, records deleted_at.
   * - Revokes all refresh tokens (terminates all sessions).
   * - Schedules an anonymization job for 30 days from now.
   */
  async initiateAccountDeletion(
    accountId: string,
    accountType: AccountType
  ): Promise<void> {
    if (accountType !== AccountType.USER) {
      throw new BadRequestException({
        error_code: "DELETION_NOT_ALLOWED",
        message: `Account deletion via this endpoint is only available to user accounts. Received: ${accountType}`,
      })
    }

    const account = await this.prisma.account.findUniqueOrThrow({
      where: { id: accountId },
    })

    if (account.status === "pending_deletion") {
      // Idempotent — already in deletion grace period
      this.logger.warn({
        event: "deletion_already_pending",
        account_id: accountId,
      })
      return
    }

    if (account.status === "deleted") {
      throw new BadRequestException({
        error_code: "ACCOUNT_ALREADY_DELETED",
        message: "Account has already been deleted.",
      })
    }

    const runAt = new Date(Date.now() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000)

    try {
      await this.prisma.$transaction([
        // Move account to pending_deletion
        this.prisma.account.update({
          where: { id: accountId },
          data: {
            status: "pending_deletion",
            deletedAt: new Date(),
          },
        }),
        // Schedule anonymization job
        this.prisma.deletionJob.upsert({
          where: { accountId },
          create: { accountId, runAt },
          update: { runAt }, // reset if called again somehow
        }),
      ])

      // Revoke all sessions — done outside transaction (separate DB call is fine,
      // worst case tokens stay valid for up to 15 min access token lifetime)
      await this.refreshTokenService.revokeAllForAccount(accountId)

      this.logger.log({
        event: "account_deletion_initiated",
        account_id: accountId,
        run_at: runAt.toISOString(),
      })
    } catch (err) {
      this.logger.error({
        event: "account_deletion_initiate_failed",
        account_id: accountId,
        error: (err as Error).message,
      })
      // TODO(KAN-53): Sentry.captureException(err);
      throw err
    }
  }

  // ---------------------------------------------------------------------------
  // Sign-in restore
  // ---------------------------------------------------------------------------

  /**
   * Called by sign-in handlers when a verified provider identity matches an
   * account in pending_deletion state.
   *
   * Flips status back to active, clears deleted_at, removes the deletion job.
   *
   * @returns { restored: true } so the sign-in response can include account_restored
   */
  async restoreAccountIfPendingDeletion(
    accountId: string
  ): Promise<{ restored: boolean }> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    })

    if (!account || account.status !== "pending_deletion") {
      return { restored: false }
    }

    try {
      await this.prisma.$transaction([
        this.prisma.account.update({
          where: { id: accountId },
          data: { status: "active", deletedAt: null },
        }),
        this.prisma.deletionJob.deleteMany({
          where: { accountId },
        }),
      ])

      this.logger.log({ event: "account_restored", account_id: accountId })
      return { restored: true }
    } catch (err) {
      this.logger.error({
        event: "account_restore_failed",
        account_id: accountId,
        error: (err as Error).message,
      })
      // TODO(KAN-53): Sentry.captureException(err);
      throw err
    }
  }

  // ---------------------------------------------------------------------------
  // Anonymization cron job
  // ---------------------------------------------------------------------------

  /**
   * Runs daily at the configured UTC hour (DELETION_JOB_HOUR, default 03:00).
   * Processes all deletion_jobs whose run_at is in the past.
   *
   * Idempotent: re-running on an already-deleted account is a no-op because
   * the deletion_jobs row is removed after successful anonymization.
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async processDueDeletions(): Promise<void> {
    const now = new Date()

    const due = await this.prisma.deletionJob.findMany({
      where: { runAt: { lte: now } },
      include: { account: true },
    })

    if (due.length === 0) {
      this.logger.debug({
        event: "deletion_job_no_due",
        checked_at: now.toISOString(),
      })
      return
    }

    this.logger.log({ event: "deletion_job_start", due_count: due.length })

    let succeeded = 0
    let failed = 0

    for (const job of due) {
      try {
        await this.anonymizeAccount(job.account, job.id)
        succeeded++
      } catch (err) {
        failed++
        this.logger.error({
          event: "deletion_job_item_failed",
          account_id: job.accountId,
          error: (err as Error).message,
        })
        // TODO(KAN-53): Sentry.captureException(err);
        // Continue processing remaining jobs — don't let one failure block others
      }
    }

    this.logger.log({ event: "deletion_job_done", succeeded, failed })
  }

  /**
   * Exposed for testing — allows manual trigger outside the cron schedule.
   */
  async processDueDeletionsNow(): Promise<{
    succeeded: number
    failed: number
  }> {
    const now = new Date()
    const due = await this.prisma.deletionJob.findMany({
      where: { runAt: { lte: now } },
      include: { account: true },
    })

    let succeeded = 0
    let failed = 0

    for (const job of due) {
      try {
        await this.anonymizeAccount(job.account, job.id)
        succeeded++
      } catch (err) {
        failed++
        this.logger.error({
          event: "deletion_job_item_failed",
          account_id: job.accountId,
          error: (err as Error).message,
        })
      }
    }

    return { succeeded, failed }
  }

  // ---------------------------------------------------------------------------
  // Internal — anonymize a single account
  // ---------------------------------------------------------------------------

  private async anonymizeAccount(
    account: Account,
    jobId: string
  ): Promise<void> {
    // Already anonymized — idempotent no-op
    if (account.status === "deleted" && account.anonymizedAt !== null) {
      this.logger.warn({
        event: "deletion_job_already_anonymized",
        account_id: account.id,
      })
      await this.prisma.deletionJob.deleteMany({ where: { id: jobId } })
      return
    }

    // Synthetic placeholder preserves uniqueness constraint without blocking re-signup
    const placeholder = `deleted+${account.id}@deleted.local`

    await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: account.id },
        data: {
          status: "deleted",
          email: placeholder,
          emailNormalized: placeholder,
          displayName: null,
          providerSubjectId: null,
          // avatarUrl cleared — no point keeping an image reference
          avatarUrl: null,
          // passwordHash cleared — account is gone
          passwordHash: null,
          anonymizedAt: new Date(),
        },
      }),
      this.prisma.deletionJob.delete({ where: { id: jobId } }),
    ])

    this.logger.log({ event: "account_anonymized", account_id: account.id })
  }
}
