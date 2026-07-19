import { Test, TestingModule } from "@nestjs/testing"
import { type AccessTokenClaims, AccountType } from "@sable/contracts"
import type { Request, Response } from "express"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { ConsentService } from "./consent.service"
import { DeletionService } from "./deletion.service"
import { EmailAuthService } from "./email-auth.service"
import { RefreshTokenService } from "./refresh-token.service"
import { SignInService } from "./sign-in.service"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRefreshTokenService = {
  rotateRefreshToken: jest.fn(),
  revokeByToken: jest.fn(),
  revokeAllForAccount: jest.fn(),
}

const mockAuthService = {
  issueAccessToken: jest.fn().mockReturnValue("mock.access.token"),
}

const mockDeletionService = {}
const mockSignInService = {
  refreshCookieName: "sable_rt_creator",
  buildRefreshCookieOptions: jest.fn(),
}
const mockConsentService = {}
const mockEmailAuthService = {}

function mockReq(
  overrides: Partial<Request> & {
    user?: AccessTokenClaims
    cookies?: Record<string, string | undefined>
  } = {}
): Request {
  return {
    user: {
      sub: "acc_123",
      account_type: AccountType.USER,
      role: null,
      iat: 0,
      exp: 0,
      iss: "test",
    },
    cookies: {},
    ...overrides,
  } as Request
}

function mockRes(): Response {
  return {
    clearCookie: jest.fn(),
    cookie: jest.fn(),
  } as unknown as Response
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AuthController — logout", () => {
  let controller: AuthController

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: DeletionService, useValue: mockDeletionService },
        { provide: SignInService, useValue: mockSignInService },
        { provide: ConsentService, useValue: mockConsentService },
        { provide: EmailAuthService, useValue: mockEmailAuthService },
      ],
    }).compile()

    controller = module.get(AuthController)
  })

  // -------------------------------------------------------------------------
  // Single-device logout — mobile (token in body)
  // -------------------------------------------------------------------------

  describe("single-device logout (mobile)", () => {
    it("revokes the presented refresh token", async () => {
      mockRefreshTokenService.revokeByToken.mockResolvedValue(undefined)

      await controller.logout(
        { refresh_token: "abc123", logout_all: false },
        mockReq(),
        mockRes()
      )

      expect(mockRefreshTokenService.revokeByToken).toHaveBeenCalledWith(
        "abc123"
      )
      expect(mockRefreshTokenService.revokeAllForAccount).not.toHaveBeenCalled()
    })

    it("does not clear cookie for mobile client", async () => {
      mockRefreshTokenService.revokeByToken.mockResolvedValue(undefined)
      const res = mockRes()

      await controller.logout(
        {
          refresh_token: "abc123",
          logout_all: false,
        },
        mockReq(),
        res
      )

      expect(res.clearCookie).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // Single-device logout — web (token in cookie)
  // -------------------------------------------------------------------------

  describe("single-device logout (web)", () => {
    it("revokes token from cookie and clears it", async () => {
      mockRefreshTokenService.revokeByToken.mockResolvedValue(undefined)
      const res = mockRes()

      await controller.logout(
        {
          refresh_token: "",
          logout_all: false,
        },
        mockReq({
          cookies: { sable_rt_creator: "cookie-token-xyz" },
          user: {
            sub: "acc_123",
            account_type: AccountType.CREATOR,
            role: null,
            iat: 0,
            exp: 0,
            iss: "test",
          },
        }),
        res
      )

      expect(mockRefreshTokenService.revokeByToken).toHaveBeenCalledWith(
        "cookie-token-xyz"
      )
      expect(res.clearCookie).toHaveBeenCalledWith("sable_rt_creator", {
        path: "/",
      })
      expect(res.clearCookie).toHaveBeenCalledWith("sable_rt", {
        path: "/",
      })
    })
  })

  // -------------------------------------------------------------------------
  // logout_all
  // -------------------------------------------------------------------------

  describe("logout_all", () => {
    it("revokes all tokens for the account", async () => {
      mockRefreshTokenService.revokeAllForAccount.mockResolvedValue(3)
      const res = mockRes()

      await controller.logout(
        {
          logout_all: true,
          refresh_token: "",
        },
        mockReq(),
        res
      )

      expect(mockRefreshTokenService.revokeAllForAccount).toHaveBeenCalledWith(
        "acc_123"
      )
      expect(mockRefreshTokenService.revokeByToken).not.toHaveBeenCalled()
    })

    it("clears cookie on logout_all even for mobile request", async () => {
      mockRefreshTokenService.revokeAllForAccount.mockResolvedValue(2)
      const res = mockRes()

      await controller.logout(
        { refresh_token: "tok", logout_all: true },
        mockReq(),
        res
      )

      // logout_all always clears the cookie
      expect(res.clearCookie).toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // Double-logout (idempotent)
  // -------------------------------------------------------------------------

  describe("double-logout", () => {
    it("is idempotent — second logout does not throw", async () => {
      // revokeByToken is a no-op for unknown tokens (already covered in refresh-token tests)
      mockRefreshTokenService.revokeByToken.mockResolvedValue(undefined)

      await expect(
        controller.logout(
          {
            refresh_token: "already-revoked-token",
            logout_all: false,
          },
          mockReq(),
          mockRes()
        )
      ).resolves.not.toThrow()

      // Called twice — both succeed
      await expect(
        controller.logout(
          {
            refresh_token: "already-revoked-token",
            logout_all: false,
          },
          mockReq(),
          mockRes()
        )
      ).resolves.not.toThrow()
    })
  })

  // -------------------------------------------------------------------------
  // No token presented
  // -------------------------------------------------------------------------

  describe("no token", () => {
    it("succeeds silently when no token is presented", async () => {
      await expect(
        controller.logout(
          {
            refresh_token: "",
            logout_all: false,
          },
          mockReq(),
          mockRes()
        )
      ).resolves.not.toThrow()

      expect(mockRefreshTokenService.revokeByToken).not.toHaveBeenCalled()
      expect(mockRefreshTokenService.revokeAllForAccount).not.toHaveBeenCalled()
    })
  })
})
