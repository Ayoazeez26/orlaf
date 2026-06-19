import { ConflictException, UnauthorizedException } from "@nestjs/common"

import {
  OAuthProvider,
  ProviderTokenError,
  ProviderTokenErrorCode,
} from "@sable/contracts"

import { SignInService } from "./sign-in.service"

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const googleClaims = {
  sub: "google|abc123",
  email: "user@gmail.com",
  email_verified: true,
  name: "Test User",
}

const appleClaims = {
  sub: "apple|xyz789",
  email: "user@privaterelay.appleid.com",
  email_verified: true,
  is_private_email: true,
}

const activeUserAccount = {
  id: "acc_1",
  accountType: "user" as const,
  email: "user@gmail.com",
  emailNormalized: "user@gmail.com",
  provider: "google" as const,
  providerSubjectId: "google|abc123",
  displayName: "Test User",
  avatarUrl: null,
  status: "active" as const,
  passwordHash: null,
  mustChangePassword: false,
  deletedAt: null,
  anonymizedAt: null,
  needsConsent: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockPrisma = {
  account: {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
  },
}

const mockAuthService = {
  issueAccessToken: jest.fn().mockReturnValue("mock.access.token"),
}

const mockRefreshTokenService = {
  issueRefreshToken: jest.fn().mockResolvedValue("mock-refresh-token"),
}

const mockDeletionService = {
  restoreAccountIfPendingDeletion: jest
    .fn()
    .mockResolvedValue({ restored: false }),
}

const mockProviderTokenService = {
  verifyProviderIdToken: jest.fn(),
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("SignInService", () => {
  let service: SignInService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = new SignInService(
      mockPrisma as any,
      mockAuthService as any,
      mockRefreshTokenService as any,
      mockDeletionService as any,
      mockProviderTokenService as any
    )
  })

  // -------------------------------------------------------------------------
  // Google — happy path (existing account, mobile)
  // -------------------------------------------------------------------------

  describe("signInWithGoogle()", () => {
    it("returns access_token and refresh_token for existing mobile user", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        googleClaims
      )
      mockPrisma.account.findUnique.mockResolvedValue(activeUserAccount)

      const { response, refreshToken } = await service.signInWithGoogle({
        id_token: "google-id-token",
        surface: "mobile",
      })

      expect(response.access_token).toBe("mock.access.token")
      expect(refreshToken).toBe("mock-refresh-token")
      expect(response.account_type).toBe("user")
      expect(response.account_restored).toBe(false)
    })

    it("passes surface=mobile audience to verifier", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        googleClaims
      )
      mockPrisma.account.findUnique.mockResolvedValue(activeUserAccount)

      await service.signInWithGoogle({ id_token: "tok", surface: "mobile" })

      expect(
        mockProviderTokenService.verifyProviderIdToken
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          surface: "mobile",
          provider: OAuthProvider.GOOGLE,
        })
      )
    })

    it("passes surface=web audience for creator-web", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue({
        ...googleClaims,
        email: "creator@gmail.com",
      })
      mockPrisma.account.findUnique
        .mockResolvedValueOnce(null) // provider lookup
        .mockResolvedValueOnce(null) // email lookup
      mockPrisma.account.create.mockResolvedValue({
        ...activeUserAccount,
        accountType: "creator",
        status: "onboarding",
      })

      await service.signInWithGoogle({
        id_token: "tok",
        surface: "creator-web",
      })

      expect(
        mockProviderTokenService.verifyProviderIdToken
      ).toHaveBeenCalledWith(expect.objectContaining({ surface: "web" }))
    })
  })

  // -------------------------------------------------------------------------
  // New account creation
  // -------------------------------------------------------------------------

  describe("new account creation", () => {
    it("creates a user account for mobile surface", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        googleClaims
      )
      mockPrisma.account.findUnique.mockResolvedValue(null)
      mockPrisma.account.create.mockResolvedValue({
        ...activeUserAccount,
        id: "acc_new",
      })

      const { response } = await service.signInWithGoogle({
        id_token: "tok",
        surface: "mobile",
      })

      expect(mockPrisma.account.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ accountType: "user" }),
        })
      )
      expect(response.needs_consent).toBe(true) // new account
    })

    it("creates a creator account with status=onboarding for creator-web", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        googleClaims
      )
      mockPrisma.account.findUnique.mockResolvedValue(null)
      mockPrisma.account.create.mockResolvedValue({
        ...activeUserAccount,
        accountType: "creator",
        status: "onboarding",
      })

      await service.signInWithGoogle({
        id_token: "tok",
        surface: "creator-web",
      })

      expect(mockPrisma.account.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            accountType: "creator",
            status: "onboarding",
          }),
        })
      )
    })

    it("persists Apple name on first sign-in", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue({
        ...appleClaims,
        name: undefined,
      })
      mockPrisma.account.findUnique.mockResolvedValue(null)
      mockPrisma.account.create.mockResolvedValue({
        ...activeUserAccount,
        displayName: "Jane Doe",
      })

      await service.signInWithApple({
        id_token: "apple-tok",
        surface: "mobile",
        name: { given_name: "Jane", family_name: "Doe" },
      })

      expect(mockPrisma.account.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ displayName: "Jane Doe" }),
        })
      )
    })
  })

  // -------------------------------------------------------------------------
  // Restore from pending_deletion
  // -------------------------------------------------------------------------

  describe("restore from pending_deletion", () => {
    it("restores account and sets account_restored=true", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        googleClaims
      )
      mockPrisma.account.findUnique.mockResolvedValue({
        ...activeUserAccount,
        status: "pending_deletion",
      })
      mockDeletionService.restoreAccountIfPendingDeletion.mockResolvedValue({
        restored: true,
      })
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue(activeUserAccount)

      const { response } = await service.signInWithGoogle({
        id_token: "tok",
        surface: "mobile",
      })

      expect(response.account_restored).toBe(true)
      expect(
        mockDeletionService.restoreAccountIfPendingDeletion
      ).toHaveBeenCalledWith("acc_1")
    })
  })

  // -------------------------------------------------------------------------
  // Duplicate email conflict
  // -------------------------------------------------------------------------

  describe("duplicate email conflict", () => {
    it("throws 409 when email is registered with a different provider", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        googleClaims
      )
      // Provider lookup: not found
      mockPrisma.account.findUnique
        .mockResolvedValueOnce(null)
        // Email lookup: found but registered with Apple
        .mockResolvedValueOnce({ ...activeUserAccount, provider: "apple" })

      await expect(
        service.signInWithGoogle({ id_token: "tok", surface: "mobile" })
      ).rejects.toThrow(ConflictException)
    })

    it("includes original provider in the 409 response", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        googleClaims
      )
      mockPrisma.account.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ...activeUserAccount, provider: "apple" })

      try {
        await service.signInWithGoogle({ id_token: "tok", surface: "mobile" })
      } catch (err: any) {
        expect(err.response?.provider).toBe("apple")
        expect(err.response?.error_code).toBe(
          "email_already_registered_with_other_provider"
        )
      }
    })
  })

  // -------------------------------------------------------------------------
  // Verifier failure
  // -------------------------------------------------------------------------

  describe("verifier failure", () => {
    it("throws 401 on expired token", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockRejectedValue(
        new ProviderTokenError("expired", ProviderTokenErrorCode.EXPIRED)
      )

      await expect(
        service.signInWithGoogle({ id_token: "bad", surface: "mobile" })
      ).rejects.toThrow(UnauthorizedException)
    })

    it("throws 401 on bad signature", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockRejectedValue(
        new ProviderTokenError("bad sig", ProviderTokenErrorCode.BAD_SIGNATURE)
      )

      await expect(
        service.signInWithApple({ id_token: "bad", surface: "mobile" })
      ).rejects.toThrow(UnauthorizedException)
    })

    it("includes provider_error_code in 401 response", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockRejectedValue(
        new ProviderTokenError(
          "wrong aud",
          ProviderTokenErrorCode.WRONG_AUDIENCE
        )
      )

      try {
        await service.signInWithGoogle({ id_token: "bad", surface: "mobile" })
      } catch (err: any) {
        expect(err.response?.provider_error_code).toBe(
          ProviderTokenErrorCode.WRONG_AUDIENCE
        )
      }
    })
  })

  // -------------------------------------------------------------------------
  // Refresh token delivery per surface
  // -------------------------------------------------------------------------

  describe("refresh token delivery", () => {
    it("returns refresh_token in response for mobile", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        googleClaims
      )
      mockPrisma.account.findUnique.mockResolvedValue(activeUserAccount)

      const { refreshToken } = await service.signInWithGoogle({
        id_token: "tok",
        surface: "mobile",
      })

      // Controller puts this in the body for mobile
      expect(refreshToken).toBe("mock-refresh-token")
    })

    it("issues 7-day refresh TTL for creator-web surface", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        googleClaims
      )
      mockPrisma.account.findUnique.mockResolvedValue({
        ...activeUserAccount,
        accountType: "creator",
      })

      await service.signInWithGoogle({
        id_token: "tok",
        surface: "creator-web",
      })

      expect(mockRefreshTokenService.issueRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({ ttl_seconds: 7 * 24 * 60 * 60 })
      )
    })

    it("issues 30-day refresh TTL for mobile surface", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        googleClaims
      )
      mockPrisma.account.findUnique.mockResolvedValue(activeUserAccount)

      await service.signInWithGoogle({ id_token: "tok", surface: "mobile" })

      expect(mockRefreshTokenService.issueRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({ ttl_seconds: 30 * 24 * 60 * 60 })
      )
    })
  })

  // -------------------------------------------------------------------------
  // Apple — happy path
  // -------------------------------------------------------------------------

  describe("signInWithApple()", () => {
    it("signs in an existing Apple user", async () => {
      mockProviderTokenService.verifyProviderIdToken.mockResolvedValue(
        appleClaims
      )
      mockPrisma.account.findUnique.mockResolvedValue({
        ...activeUserAccount,
        provider: "apple",
        providerSubjectId: "apple|xyz789",
        email: "user@privaterelay.appleid.com",
      })

      const { response } = await service.signInWithApple({
        id_token: "apple-tok",
        surface: "mobile",
      })

      expect(response.access_token).toBe("mock.access.token")
      expect(response.account_type).toBe("user")
    })
  })
})
