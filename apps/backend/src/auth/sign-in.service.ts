import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import {
  AccountState,
  AccountType,
  OAuthProvider,
  type ProviderTokenClaims,
  ProviderTokenError,
  SignInErrorCode,
  SignInResponse,
  SignInSurface,
} from "@sable/contracts"
import { CustomLogger } from "@sable/logger"
import { Account } from "src/generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { AuthService } from "./auth.service"
import {
  buildRefreshCookieOptions as getRefreshCookieOptions,
  REFRESH_COOKIE_MAX_AGE_MS,
  REFRESH_COOKIE_NAME_CREATOR,
} from "./auth-cookie.constants"
import { DeletionService } from "./deletion.service"
import { ProviderTokenService } from "./provider-token.service"
import { RefreshTokenService } from "./refresh-token.service"
import { SecurityService } from "./security.service"
import type { ParsedSessionMetadata } from "./session-metadata.util"

// TODO(KAN-53): import Sentry once OTEL is wired
// import * as Sentry from '@sentry/node';

@Injectable()
export class SignInService {
  private readonly logger = new CustomLogger(SignInService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly deletionService: DeletionService,
    private readonly providerTokenService: ProviderTokenService,
    private readonly securityService: SecurityService
  ) {}

  // ---------------------------------------------------------------------------
  // Google sign-in
  // ---------------------------------------------------------------------------

  async signInWithGoogle(input: {
    id_token: string
    surface: SignInSurface
    device_label?: string
    session?: ParsedSessionMetadata
  }): Promise<{ response: SignInResponse; refreshToken: string }> {
    const { id_token, surface, device_label, session } = input

    let claims: ProviderTokenClaims
    try {
      claims = await this.providerTokenService.verifyProviderIdToken({
        provider: OAuthProvider.GOOGLE,
        id_token,
        surface: surface === "mobile" ? "mobile" : "web",
      })
    } catch (err) {
      this.handleVerificationError(err)
    }

    return this.resolveSignIn({
      provider: OAuthProvider.GOOGLE,
      claims: claims!,
      surface,
      device_label,
      session,
    })
  }

  // ---------------------------------------------------------------------------
  // Apple sign-in
  // ---------------------------------------------------------------------------

  async signInWithApple(input: {
    id_token: string
    surface: SignInSurface
    device_label?: string
    name?: { given_name?: string | null; family_name?: string | null }
    is_private_email?: boolean
  }): Promise<{ response: SignInResponse; refreshToken: string }> {
    const { id_token, surface, device_label, name } = input

    let claims: ProviderTokenClaims
    try {
      claims = await this.providerTokenService.verifyProviderIdToken({
        provider: OAuthProvider.APPLE,
        id_token,
        surface: surface === "mobile" ? "mobile" : "web",
      })
    } catch (err) {
      this.handleVerificationError(err)
    }

    // Apple only sends name on first sign-in — use client-provided name if
    // claims don't have it (can happen when client sends it separately)
    if (!claims?.name && name) {
      const parts = [name.given_name, name.family_name].filter(Boolean)
      if (parts.length > 0) claims!.name = parts.join(" ")
    }

    return this.resolveSignIn({
      provider: OAuthProvider.APPLE,
      claims: claims!,
      surface,
      device_label,
    })
  }

  // ---------------------------------------------------------------------------
  // Core resolution — shared by both providers
  // ---------------------------------------------------------------------------

  private async resolveSignIn(input: {
    provider: OAuthProvider
    claims: ProviderTokenClaims
    surface: SignInSurface
    device_label?: string
    session?: ParsedSessionMetadata
  }): Promise<{ response: SignInResponse; refreshToken: string }> {
    const { provider, claims, surface, device_label, session } = input
    const accountType = this.surfaceToAccountType(surface)
    const emailNormalized = claims.email.trim().toLowerCase().normalize("NFC")

    // ------------------------------------------------------------------
    // 1. Lookup — by provider subject first, then by email
    // ------------------------------------------------------------------

    let account = await this.prisma.account.findUnique({
      where: {
        unique_provider_per_account_type: {
          accountType,
          provider,
          providerSubjectId: claims.sub,
        },
      },
    })

    if (!account) {
      // Fallback: email match within same account type
      const emailMatch = await this.prisma.account.findUnique({
        where: {
          unique_email_per_account_type: { accountType, emailNormalized },
        },
      })

      if (emailMatch) {
        // Email exists but registered with a different provider
        if (emailMatch.provider !== provider) {
          throw new ConflictException({
            error_code: SignInErrorCode.EMAIL_REGISTERED_WITH_OTHER_PROVIDER,
            provider: emailMatch.provider,
            message: `This email is already registered with ${emailMatch.provider}. Please sign in with ${emailMatch.provider} instead.`,
          })
        }
        account = emailMatch
      }
    }

    // ------------------------------------------------------------------
    // 2. Create if new
    // ------------------------------------------------------------------

    let isNewAccount = false
    if (!account) {
      account = await this.createAccount({
        accountType,
        provider,
        claims,
        emailNormalized,
      })
      isNewAccount = true

      this.logger.log({
        event: "account_created",
        account_id: account.id,
        account_type: accountType,
        provider,
      })
    }

    // ------------------------------------------------------------------
    // 3. Restore if pending deletion
    // ------------------------------------------------------------------

    let accountRestored = false
    if (!isNewAccount && account.status === "pending_deletion") {
      const { restored } =
        await this.deletionService.restoreAccountIfPendingDeletion(account.id)
      accountRestored = restored
      if (restored) {
        account = await this.prisma.account.findUniqueOrThrow({
          where: { id: account.id },
        })
      }
    }

    // ------------------------------------------------------------------
    // 4. Issue tokens (or defer for 2FA)
    // ------------------------------------------------------------------

    return this.issueSessionForAccount({
      account,
      surface,
      device_label,
      session,
      accountRestored,
      isNewAccount,
      provider,
    })
  }

  async completeMfaSignIn(input: {
    mfa_token: string
    code: string
    surface: SignInSurface
    device_label?: string
    session?: ParsedSessionMetadata
  }): Promise<{ response: SignInResponse; refreshToken: string }> {
    const accountId = await this.securityService.verifyMfaCode(
      input.mfa_token,
      input.code
    )

    const account = await this.prisma.account.findUniqueOrThrow({
      where: { id: accountId },
    })

    return this.issueSessionForAccount({
      account,
      surface: input.surface,
      device_label: input.device_label,
      session: input.session,
      accountRestored: false,
      isNewAccount: false,
      mfaVerified: true,
    })
  }

  async issueSessionForAccount(input: {
    account: Account
    surface: SignInSurface
    device_label?: string
    session?: ParsedSessionMetadata
    accountRestored?: boolean
    isNewAccount?: boolean
    provider?: OAuthProvider
    mfaVerified?: boolean
  }): Promise<{ response: SignInResponse; refreshToken: string }> {
    const {
      account,
      surface,
      device_label,
      session,
      accountRestored = false,
      isNewAccount = false,
      provider,
      mfaVerified = false,
    } = input
    const accountType = account.accountType as AccountType

    if (!mfaVerified && this.securityService.requiresMfa(account)) {
      const response: SignInResponse = {
        access_token: "",
        requires_2fa: true,
        mfa_token: this.securityService.issueMfaToken(account.id),
        account_type: "creator",
        account_state: this.toAccountState(account.status),
        display_name: account.displayName,
        needs_consent: account.needsConsent,
        account_restored: accountRestored,
        email: account.email,
      }

      return { response, refreshToken: "" }
    }

    const accessToken = this.authService.issueAccessToken({
      account_id: account.id,
      account_type: accountType,
      role: null,
    })

    const refreshToken = await this.refreshTokenService.issueRefreshToken({
      account_id: account.id,
      device_label,
      session: {
        ...session,
        surface: session?.surface ?? surface,
      },
      ttl_seconds: surface === "mobile" ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
    })

    if (provider) {
      this.logger.log({
        event: "sign_in_success",
        account_id: account.id,
        account_type: accountType,
        provider,
        surface,
        is_new: isNewAccount,
        restored: accountRestored,
      })
    }

    const response: SignInResponse = {
      access_token: accessToken,
      account_type: accountType as "user" | "creator",
      account_state: this.toAccountState(account.status),
      display_name: account.displayName,
      needs_consent: account.needsConsent ?? isNewAccount,
      account_restored: accountRestored,
      email: account.email,
    }

    return { response, refreshToken }
  }

  // ---------------------------------------------------------------------------
  // Session metadata — for client bootstrap after token refresh
  // ---------------------------------------------------------------------------

  async getSessionMetadata(
    accountId: string
  ): Promise<Omit<SignInResponse, "access_token" | "refresh_token">> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    })

    if (!account) {
      throw new UnauthorizedException("Account not found")
    }

    return {
      account_type: account.accountType as "user" | "creator",
      account_state: this.toAccountState(account.status),
      display_name: account.displayName,
      needs_consent: account.needsConsent,
      account_restored: false,
      email: account.email,
    }
  }

  // ---------------------------------------------------------------------------
  // Account creation
  // ---------------------------------------------------------------------------

  private async createAccount(input: {
    accountType: AccountType
    provider: OAuthProvider
    claims: ProviderTokenClaims
    emailNormalized: string
  }): Promise<Account> {
    const { accountType, provider, claims, emailNormalized } = input

    const displayName = claims.name ?? null
    const initialStatus =
      accountType === AccountType.CREATOR ? "onboarding" : "active"

    return this.prisma.account.create({
      data: {
        accountType,
        email: claims.email,
        emailNormalized,
        provider,
        providerSubjectId: claims.sub,
        displayName,
        status: initialStatus,
        // needs_consent added in the consent story (KAN-9)
        // mustChangePassword defaults to false
      },
    })
  }

  // ---------------------------------------------------------------------------
  // Cookie delivery helper (called from controller for web surface)
  // ---------------------------------------------------------------------------

  buildRefreshCookieOptions() {
    return getRefreshCookieOptions(REFRESH_COOKIE_MAX_AGE_MS)
  }

  get refreshCookieName() {
    return REFRESH_COOKIE_NAME_CREATOR
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private surfaceToAccountType(surface: SignInSurface): AccountType {
    return surface === "mobile" ? AccountType.USER : AccountType.CREATOR
  }

  private toAccountState(status: string): AccountState {
    const valid: AccountState[] = [
      "active",
      "onboarding",
      "pending_approval",
      "suspended",
      "rejected",
      "pending_deletion",
    ]
    return valid.includes(status as AccountState)
      ? (status as AccountState)
      : "active"
  }

  private handleVerificationError(err: unknown): never {
    if (err instanceof ProviderTokenError) {
      this.logger.warn({
        event: "sign_in_verification_failed",
        code: err.code,
        message: err.message,
      })
      // TODO(KAN-53): Sentry.captureException(err);
      throw new UnauthorizedException({
        error_code: SignInErrorCode.VERIFICATION_FAILED,
        provider_error_code: err.code,
        message: err.message,
      })
    }
    // TODO(KAN-53): Sentry.captureException(err);
    throw err
  }
}
