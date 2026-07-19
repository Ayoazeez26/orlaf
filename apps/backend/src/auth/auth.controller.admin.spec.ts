jest.mock("otplib", () => ({
  generateSecret: jest.fn(() => "SECRET"),
  generateURI: jest.fn(() => "otpauth://test"),
  verifySync: jest.fn(() => true),
}))

jest.mock("@sable/logger", () => ({
  CustomLogger: class CustomLogger {
    log() {}
    error() {}
    warn() {}
    debug() {}
  },
}))

import { Test, TestingModule } from "@nestjs/testing"
import {
  type AccessTokenClaims,
  AccountType,
  AdminRole,
} from "@sable/contracts"
import type { Request, Response } from "express"
import { AdminAuthService } from "./admin-auth.service"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { ConsentService } from "./consent.service"
import { DeletionService } from "./deletion.service"
import type { RefreshTokenDto } from "./dto/auth.dto"
import { EmailAuthService } from "./email-auth.service"
import { RefreshTokenService } from "./refresh-token.service"
import { SecurityService } from "./security.service"
import { SignInService } from "./sign-in.service"

const mockRefreshTokenService = {
  rotateRefreshToken: jest.fn(),
  revokeByToken: jest.fn(),
  revokeAllForAccount: jest.fn(),
}

const mockAuthService = {
  issueAccessToken: jest.fn().mockReturnValue("mock.access.token"),
}

const mockAdminAuthService = {
  signIn: jest.fn(),
  changePassword: jest.fn(),
  getSession: jest.fn(),
}

function mockRes(): Response {
  return {
    clearCookie: jest.fn(),
    cookie: jest.fn(),
  } as unknown as Response
}

function mockRefreshReq(cookies: Record<string, string | undefined>): Request {
  return { cookies } as Request
}

describe("AuthController — admin auth", () => {
  let controller: AuthController

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: DeletionService, useValue: {} },
        {
          provide: SignInService,
          useValue: { refreshCookieName: "sable_rt_creator" },
        },
        { provide: ConsentService, useValue: {} },
        { provide: EmailAuthService, useValue: {} },
        { provide: SecurityService, useValue: {} },
        { provide: AdminAuthService, useValue: mockAdminAuthService },
      ],
    }).compile()

    controller = module.get(AuthController)
  })

  describe("signInAdmin", () => {
    it("returns admin sign-in response and sets refresh cookie", async () => {
      mockAdminAuthService.signIn.mockResolvedValue({
        response: {
          access_token: "access.jwt",
          refresh_token: "refresh.opaque",
          role: AdminRole.SUPER_ADMIN,
          must_change_password: true,
          admin: {
            id: "acc_admin",
            email: "admin@sable.tv",
            display_name: "Ada Obi",
          },
        },
        refreshToken: "refresh.opaque",
      })

      const res = mockRes()
      const result = await controller.signInAdmin(
        { email: "admin@sable.tv", password: "TempPass123!" },
        res
      )

      expect(result.role).toBe(AdminRole.SUPER_ADMIN)
      expect(res.cookie).toHaveBeenCalledWith(
        "sable_rt_admin",
        "refresh.opaque",
        expect.objectContaining({ httpOnly: true })
      )
    })
  })

  describe("getAdminSession", () => {
    it("returns admin session metadata for the authenticated admin", async () => {
      mockAdminAuthService.getSession.mockResolvedValue({
        role: AdminRole.FINANCE_ADMIN,
        must_change_password: false,
        admin: {
          id: "acc_admin",
          email: "finance@sable.tv",
          display_name: "Finance Admin",
        },
      })

      const result = await controller.getAdminSession({
        user: {
          sub: "acc_admin",
          account_type: AccountType.ADMIN,
          role: AdminRole.FINANCE_ADMIN,
        },
      } as Request & { user: AccessTokenClaims })

      expect(mockAdminAuthService.getSession).toHaveBeenCalledWith("acc_admin")
      expect(result.role).toBe(AdminRole.FINANCE_ADMIN)
    })
  })

  describe("refresh", () => {
    it("re-issues admin role from the database on refresh", async () => {
      mockRefreshTokenService.rotateRefreshToken.mockResolvedValue({
        newRefreshToken: "new.refresh",
        accountId: "acc_admin",
        accountType: "admin",
        adminRole: "content_admin",
      })

      const result = await controller.refresh(
        {} as RefreshTokenDto,
        mockRefreshReq({ sable_rt_admin: "old.refresh" }),
        mockRes()
      )

      expect(mockAuthService.issueAccessToken).toHaveBeenCalledWith({
        account_id: "acc_admin",
        account_type: AccountType.ADMIN,
        role: AdminRole.CONTENT_ADMIN,
      })
      expect(result).toEqual({ access_token: "mock.access.token" })
    })

    it("keeps role null for non-admin accounts", async () => {
      mockRefreshTokenService.rotateRefreshToken.mockResolvedValue({
        newRefreshToken: "new.refresh",
        accountId: "acc_creator",
        accountType: "creator",
        adminRole: null,
      })

      await controller.refresh(
        {} as RefreshTokenDto,
        mockRefreshReq({ sable_rt_admin: "old.refresh" }),
        mockRes()
      )

      expect(mockAuthService.issueAccessToken).toHaveBeenCalledWith({
        account_id: "acc_creator",
        account_type: AccountType.CREATOR,
        role: null,
      })
    })

    it("rejects refresh when body account_type mismatches the token account", async () => {
      mockRefreshTokenService.rotateRefreshToken.mockResolvedValue({
        newRefreshToken: "new.refresh",
        accountId: "acc_creator",
        accountType: "creator",
        adminRole: null,
      })

      await expect(
        controller.refresh(
          { account_type: "admin" } as RefreshTokenDto,
          mockRefreshReq({ sable_rt_creator: "creator.refresh" }),
          mockRes()
        )
      ).rejects.toThrow(
        "Refresh token does not match the requested account type."
      )

      expect(mockAuthService.issueAccessToken).not.toHaveBeenCalled()
    })
  })
})
