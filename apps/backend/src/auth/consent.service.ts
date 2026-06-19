import { BadRequestException, Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CURRENT_POLICY_VERSIONS, type PolicyVersions } from "./policies.config"

// TODO(KAN-53): import Sentry once OTEL is wired
// import * as Sentry from '@sentry/node';

export interface RecordConsentInput {
  account_id: string
  policy_versions: PolicyVersions
  client_ip?: string
  user_agent?: string
}

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name)

  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // GET /auth/policies
  // ---------------------------------------------------------------------------

  getCurrentPolicyVersions(): PolicyVersions {
    return CURRENT_POLICY_VERSIONS
  }

  // ---------------------------------------------------------------------------
  // POST /auth/users/consent
  // ---------------------------------------------------------------------------

  /**
   * Records consent and flips needs_consent to false on the account.
   * Validates that all four policy keys are present in the body.
   * Does NOT validate that the versions match current — we record what
   * the user accepted and the client is responsible for sending current versions.
   * If versions drift, product can query consent_records for the accepted version.
   */
  async recordConsent(input: RecordConsentInput): Promise<void> {
    const { account_id, policy_versions, client_ip, user_agent } = input

    this.assertAllPolicyKeysPresent(policy_versions)

    try {
      await this.prisma.$transaction([
        // Insert immutable consent record
        this.prisma.consentRecord.create({
          data: {
            accountId: account_id,
            policyVersions: policy_versions,
            clientIp: client_ip ?? null,
            userAgent: user_agent ?? null,
          },
        }),
        // Flip needs_consent on the account
        this.prisma.account.update({
          where: { id: account_id },
          data: { needsConsent: false },
        }),
      ])

      this.logger.log({
        event: "consent_recorded",
        account_id,
        policy_versions,
      })
    } catch (err) {
      this.logger.error({
        event: "consent_record_failed",
        account_id,
        error: (err as Error).message,
      })
      // TODO(KAN-53): Sentry.captureException(err);
      throw err
    }
  }

  // ---------------------------------------------------------------------------
  // Check (used by ConsentGuard)
  // ---------------------------------------------------------------------------

  async accountNeedsConsent(account_id: string): Promise<boolean> {
    const account = await this.prisma.account.findUnique({
      where: { id: account_id },
      select: { needsConsent: true },
    })
    return account?.needsConsent ?? false
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private assertAllPolicyKeysPresent(versions: PolicyVersions): void {
    const required: (keyof PolicyVersions)[] = [
      "terms",
      "privacy",
      "community_guidelines",
      "payment",
    ]

    const missing = required.filter((k) => !versions[k])

    if (missing.length > 0) {
      throw new BadRequestException({
        error_code: "MISSING_POLICY_VERSIONS",
        missing,
        message: `Missing required policy version keys: ${missing.join(", ")}`,
      })
    }
  }
}
