import { ConflictException, UnauthorizedException } from "@nestjs/common"
import { SignInErrorCode } from "@sable/contracts"
import type { EmailService } from "../email/email.service"
import type { OtpService } from "../email/otp.service"
import type { PrismaService } from "../prisma/prisma.service"
import type { AccountService } from "./account.service"
import { EmailAuthService } from "./email-auth.service"
import type { SignInService } from "./sign-in.service"

const mockPrisma = {
  account: {
    create: jest.fn(),
    update: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  },
  emailVerification: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  $transaction: jest.fn((ops: unknown[]) => Promise.all(ops)),
}

const mockAccountService = {
  normalizeEmail: jest.fn((email: string) => email.trim().toLowerCase()),
  findByEmail: jest.fn(),
  hashPassword: jest.fn().mockResolvedValue("salt:hash"),
  verifyPassword: jest.fn(),
}

const mockEmailService = {
  sendVerificationCode: jest.fn().mockResolvedValue(undefined),
}

const mockOtpService = {
  expiresIn: 600,
  maxAttemptsLimit: 5,
  generateCode: jest.fn().mockReturnValue("123456"),
  hashCode: jest.fn().mockResolvedValue("salt:codehash"),
  verifyCode: jest.fn(),
  expiresAtFromNow: jest.fn().mockReturnValue(new Date(Date.now() + 600_000)),
  isExpired: jest.fn().mockReturnValue(false),
  canResend: jest.fn().mockReturnValue(true),
  resendCooldownRemainingSeconds: jest.fn().mockReturnValue(0),
}

const mockSignInService = {
  issueSessionForAccount: jest.fn().mockResolvedValue({
    response: {
      access_token: "token",
      account_type: "creator",
      account_state: "onboarding",
      display_name: "Jane Doe",
      needs_consent: true,
      account_restored: false,
      email: "jane@example.com",
    },
    refreshToken: "refresh",
  }),
}

const mockCreatorInvitesService = {
  assertValidForSignup: jest.fn().mockResolvedValue(undefined),
  acceptByToken: jest.fn().mockResolvedValue(undefined),
}

describe("EmailAuthService", () => {
  let service: EmailAuthService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new EmailAuthService(
      mockPrisma as unknown as PrismaService,
      mockAccountService as unknown as AccountService,
      mockCreatorInvitesService as never,
      mockEmailService as unknown as EmailService,
      mockOtpService as unknown as OtpService,
      mockSignInService as unknown as SignInService
    )
  })

  it("creates an unverified creator account on sign-up", async () => {
    mockAccountService.findByEmail.mockResolvedValue(null)
    mockPrisma.account.create.mockResolvedValue({
      id: "acc_1",
      email: "jane@example.com",
    })
    mockPrisma.emailVerification.create.mockResolvedValue({ id: "ev_1" })

    const result = await service.signUp({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "secret12",
    })

    expect(result.verification_id).toBe("ev_1")
    expect(mockEmailService.sendVerificationCode).toHaveBeenCalled()
    expect(mockPrisma.account.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "email_unverified",
          provider: "email",
          needsConsent: true,
        }),
      })
    )
  })

  it("rejects sign-in when email is not verified", async () => {
    mockAccountService.findByEmail.mockResolvedValue({
      id: "acc_1",
      provider: "email",
      passwordHash: "salt:hash",
      emailVerifiedAt: null,
      status: "email_unverified",
    })
    mockAccountService.verifyPassword.mockResolvedValue(true)
    mockPrisma.emailVerification.findFirst.mockResolvedValue({ id: "ev_1" })

    await expect(
      service.signIn({
        email: "jane@example.com",
        password: "secret12",
        surface: "creator-web",
      })
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        error_code: SignInErrorCode.EMAIL_NOT_VERIFIED,
        verification_id: "ev_1",
      }),
    })
  })

  it("rejects sign-in with invalid credentials", async () => {
    mockAccountService.findByEmail.mockResolvedValue(null)

    await expect(
      service.signIn({
        email: "jane@example.com",
        password: "secret12",
        surface: "creator-web",
      })
    ).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it("conflicts when email is registered with google", async () => {
    mockAccountService.findByEmail.mockResolvedValue({
      id: "acc_1",
      provider: "google",
      emailVerifiedAt: new Date(),
    })

    await expect(
      service.signUp({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "secret12",
      })
    ).rejects.toBeInstanceOf(ConflictException)
  })
})
