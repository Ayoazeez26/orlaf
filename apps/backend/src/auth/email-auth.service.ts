import {
  ConflictException,
  ForbiddenException,
  GoneException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"
import {
  AccountType,
  EmailSignInBody,
  EmailSignUpBody,
  EmailSignUpResponse,
  OAuthProvider,
  SignInErrorCode,
  SignInResponse,
  VerifyEmailInput,
} from "@sable/contracts"
import { CustomLogger } from "@sable/logger"
import { Account } from "src/generated/prisma/client"
import { CreatorInvitesService } from "../creator-invites/creator-invites.service"
import { EmailService } from "../email/email.service"
import { OtpService } from "../email/otp.service"
import { PrismaService } from "../prisma/prisma.service"
import { AccountService } from "./account.service"
import type { ParsedSessionMetadata } from "./session-metadata.util"
import { SignInService } from "./sign-in.service"

@Injectable()
export class EmailAuthService {
  private readonly logger = new CustomLogger(EmailAuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountService,
    private readonly creatorInvitesService: CreatorInvitesService,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
    private readonly signInService: SignInService
  ) {}

  async signUp(input: EmailSignUpBody): Promise<EmailSignUpResponse> {
    if (input.invite_token) {
      await this.creatorInvitesService.assertValidForSignup(
        input.invite_token,
        input.email
      )
    }

    const emailNormalized = this.accountService.normalizeEmail(input.email)
    const displayName =
      `${input.firstName.trim()} ${input.lastName.trim()}`.trim()

    const existing = await this.accountService.findByEmail(
      AccountType.CREATOR,
      input.email
    )

    if (existing) {
      if (existing.provider && existing.provider !== OAuthProvider.EMAIL) {
        throw new ConflictException({
          error_code: SignInErrorCode.EMAIL_REGISTERED_WITH_OTHER_PROVIDER,
          provider: existing.provider,
          message: `This email is already registered with ${existing.provider}. Please sign in with ${existing.provider} instead.`,
        })
      }

      if (existing.emailVerifiedAt) {
        throw new ConflictException({
          error_code: SignInErrorCode.EMAIL_ALREADY_REGISTERED,
          message: "This email is already registered. Please log in instead.",
        })
      }

      const passwordHash = await this.accountService.hashPassword(
        input.password
      )
      const account = await this.prisma.account.update({
        where: { id: existing.id },
        data: {
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          displayName,
          passwordHash,
          email: input.email.trim(),
          emailNormalized,
          status: "email_unverified",
          needsConsent: true,
        },
      })

      const verification = await this.createAndSendVerification(account)
      return this.toSignUpResponse(account.email, verification.id)
    }

    const passwordHash = await this.accountService.hashPassword(input.password)
    const account = await this.prisma.account.create({
      data: {
        accountType: AccountType.CREATOR,
        email: input.email.trim(),
        emailNormalized,
        provider: OAuthProvider.EMAIL,
        providerSubjectId: null,
        passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        displayName,
        status: "email_unverified",
        needsConsent: true,
      },
    })

    this.logger.log({
      event: "email_sign_up_created",
      account_id: account.id,
    })

    const verification = await this.createAndSendVerification(account)
    return this.toSignUpResponse(account.email, verification.id)
  }

  async verifyEmail(
    input: VerifyEmailInput & { session?: ParsedSessionMetadata }
  ): Promise<{ response: SignInResponse; refreshToken: string }> {
    const verification = await this.prisma.emailVerification.findUnique({
      where: { id: input.verification_id },
      include: { account: true },
    })

    if (!verification || verification.consumedAt) {
      throw new NotFoundException({
        error_code: SignInErrorCode.INVALID_CODE,
        message: "Invalid verification request.",
      })
    }

    if (this.otpService.isExpired(verification.expiresAt)) {
      throw new GoneException({
        error_code: SignInErrorCode.CODE_EXPIRED,
        message: "Verification code has expired. Please request a new one.",
      })
    }

    if (verification.attempts >= this.otpService.maxAttemptsLimit) {
      throw new HttpException(
        {
          error_code: SignInErrorCode.TOO_MANY_ATTEMPTS,
          message: "Too many attempts. Please request a new code.",
        },
        HttpStatus.TOO_MANY_REQUESTS
      )
    }

    const valid = await this.otpService.verifyCode(
      input.code,
      verification.codeHash
    )

    if (!valid) {
      await this.prisma.emailVerification.update({
        where: { id: verification.id },
        data: { attempts: { increment: 1 } },
      })
      throw new UnauthorizedException({
        error_code: SignInErrorCode.INVALID_CODE,
        message: "Invalid verification code.",
      })
    }

    const now = new Date()
    await this.prisma.$transaction([
      this.prisma.emailVerification.update({
        where: { id: verification.id },
        data: { consumedAt: now },
      }),
      this.prisma.account.update({
        where: { id: verification.accountId },
        data: {
          emailVerifiedAt: now,
          status: "onboarding",
        },
      }),
    ])

    const account = await this.prisma.account.findUniqueOrThrow({
      where: { id: verification.accountId },
    })

    if (input.invite_token) {
      await this.creatorInvitesService.acceptByToken(
        input.invite_token,
        account.email
      )
    }

    this.logger.log({
      event: "email_verified",
      account_id: account.id,
    })

    return this.signInService.issueSessionForAccount({
      account,
      surface: input.surface ?? "creator-web",
      device_label: input.device_label,
      session: input.session,
    })
  }

  async resendVerification(verificationId: string): Promise<void> {
    const verification = await this.prisma.emailVerification.findUnique({
      where: { id: verificationId },
      include: { account: true },
    })

    if (!verification || verification.consumedAt) {
      throw new NotFoundException({
        error_code: SignInErrorCode.INVALID_CODE,
        message: "Invalid verification request.",
      })
    }

    // Guard against resending against an expired verification
    if (this.otpService.isExpired(verification.expiresAt)) {
      throw new GoneException({
        error_code: SignInErrorCode.CODE_EXPIRED,
        message: "Verification code has expired. Please request a new one.",
      })
    }

    if (verification.account.emailVerifiedAt) {
      throw new ConflictException({
        error_code: SignInErrorCode.EMAIL_ALREADY_REGISTERED,
        message: "This email is already verified. Please log in instead.",
      })
    }

    if (!this.otpService.canResend(verification.lastSentAt)) {
      throw new HttpException(
        {
          error_code: SignInErrorCode.RESEND_COOLDOWN,
          message: "Please wait before requesting another code.",
          retry_after_seconds: this.otpService.resendCooldownRemainingSeconds(
            verification.lastSentAt
          ),
        },
        HttpStatus.TOO_MANY_REQUESTS
      )
    }

    const code = this.otpService.generateCode()
    const codeHash = await this.otpService.hashCode(code)

    await this.prisma.emailVerification.update({
      where: { id: verification.id },
      data: {
        codeHash,
        expiresAt: this.otpService.expiresAtFromNow(),
        attempts: 0,
        lastSentAt: new Date(),
      },
    })

    // Fire-and-forget — don't block on external email provider
    this.emailService
      .sendVerificationCode({
        to: verification.account.email,
        code,
        expiresInMinutes: Math.ceil(this.otpService.expiresIn / 60),
        verifyUrl: `${process.env.APP_URL}/verify-email?vid=${verification.id}&code=${code}`,
      })
      .catch((err) => {
        this.logger.error({
          event: "resend_verification_email_send_failed",
          account_id: verification.accountId,
          error: err?.message,
        })
      })
  }

  async signIn(
    input: EmailSignInBody & { session?: ParsedSessionMetadata }
  ): Promise<{ response: SignInResponse; refreshToken: string }> {
    const account = await this.accountService.findByEmail(
      AccountType.CREATOR,
      input.email
    )

    if (
      !account?.provider ||
      account.provider !== OAuthProvider.EMAIL ||
      !account.passwordHash
    ) {
      throw new UnauthorizedException({
        error_code: SignInErrorCode.INVALID_CREDENTIALS,
        message: "Invalid email or password.",
      })
    }

    const passwordValid = await this.accountService.verifyPassword(
      input.password,
      account.passwordHash
    )

    if (!passwordValid) {
      throw new UnauthorizedException({
        error_code: SignInErrorCode.INVALID_CREDENTIALS,
        message: "Invalid email or password.",
      })
    }

    if (!account.emailVerifiedAt) {
      const activeVerification = await this.prisma.emailVerification.findFirst({
        where: {
          accountId: account.id,
          consumedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      })

      throw new ForbiddenException({
        error_code: SignInErrorCode.EMAIL_NOT_VERIFIED,
        message: "Please verify your email before signing in.",
        verification_id: activeVerification?.id ?? null,
      })
    }

    if (account.status === "suspended") {
      throw new UnauthorizedException({
        error_code: SignInErrorCode.ACCOUNT_SUSPENDED,
        message: "This account has been suspended.",
      })
    }

    this.logger.log({
      event: "email_sign_in_success",
      account_id: account.id,
      account_state: account.status,
    })

    return this.signInService.issueSessionForAccount({
      account,
      surface: input.surface,
      device_label: input.device_label,
      session: input.session,
    })
  }

  private async createAndSendVerification(account: Account) {
    const code = this.otpService.generateCode()
    const codeHash = await this.otpService.hashCode(code)
    const now = new Date()

    const verification = await this.prisma.$transaction(async (tx) => {
      await tx.emailVerification.updateMany({
        where: { accountId: account.id, consumedAt: null },
        data: { consumedAt: now },
      })

      return tx.emailVerification.create({
        data: {
          accountId: account.id,
          codeHash,
          expiresAt: this.otpService.expiresAtFromNow(),
          lastSentAt: now,
        },
      })
    })

    // Fire-and-forget — don't block on external email provider
    this.emailService
      .sendVerificationCode({
        to: account.email,
        code,
        expiresInMinutes: Math.ceil(this.otpService.expiresIn / 60),
        verifyUrl: `${process.env.APP_URL}/verify-email?vid=${verification.id}&code=${code}`,
      })
      .catch((err) => {
        this.logger.error({
          event: "verification_email_send_failed",
          account_id: account.id,
          error: err?.message,
        })
      })

    return verification
  }

  private toSignUpResponse(
    email: string,
    verificationId: string
  ): EmailSignUpResponse {
    return {
      verification_id: verificationId,
      expires_in_seconds: this.otpService.expiresIn,
      masked_email: this.maskEmail(email),
    }
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split("@")
    if (!local || !domain) return email
    const visible = local.slice(0, 1)
    return `${visible}***@${domain}`
  }
}
