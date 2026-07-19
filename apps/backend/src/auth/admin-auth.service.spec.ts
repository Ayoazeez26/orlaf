jest.mock("@sable/logger", () => ({
  CustomLogger: class CustomLogger {
    log() {}
    error() {}
    warn() {}
    debug() {}
  },
}))

import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common"
import { AccountType, AdminRole } from "@sable/contracts"
import { AdminAuthService } from "./admin-auth.service"

const mockAccount = {
  id: "acc_admin_1",
  accountType: "admin" as const,
  email: "admin@sable.tv",
  emailNormalized: "admin@sable.tv",
  passwordHash: "salt:hash",
  mustChangePassword: true,
  displayName: "Ada Obi",
  status: "active" as const,
  adminRole: "super_admin" as const,
}

const mockPrisma = {
  account: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}

const mockAccountService = {
  findByEmail: jest.fn(),
  verifyPassword: jest.fn(),
  hashPassword: jest.fn(),
}

const mockAuthService = {
  issueAccessToken: jest.fn().mockReturnValue("access.jwt"),
}

const mockRefreshTokenService = {
  issueRefreshToken: jest.fn().mockResolvedValue("refresh.opaque"),
}

describe("AdminAuthService", () => {
  let service: AdminAuthService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new AdminAuthService(
      mockPrisma as any,
      mockAccountService as any,
      mockAuthService as any,
      mockRefreshTokenService as any
    )
  })

  describe("signIn()", () => {
    it("issues tokens for a valid admin", async () => {
      mockAccountService.findByEmail.mockResolvedValue(mockAccount)
      mockAccountService.verifyPassword.mockResolvedValue(true)

      const result = await service.signIn({
        email: "admin@sable.tv",
        password: "TempPass123!",
      })

      expect(mockAuthService.issueAccessToken).toHaveBeenCalledWith({
        account_id: "acc_admin_1",
        account_type: AccountType.ADMIN,
        role: AdminRole.SUPER_ADMIN,
      })
      expect(result.response).toEqual({
        access_token: "access.jwt",
        refresh_token: "refresh.opaque",
        role: AdminRole.SUPER_ADMIN,
        must_change_password: true,
        admin: {
          id: "acc_admin_1",
          email: "admin@sable.tv",
          display_name: "Ada Obi",
        },
      })
    })

    it("rejects invalid credentials", async () => {
      mockAccountService.findByEmail.mockResolvedValue(null)

      await expect(
        service.signIn({ email: "admin@sable.tv", password: "wrong" })
      ).rejects.toThrow(UnauthorizedException)
    })

    it("rejects suspended admins", async () => {
      mockAccountService.findByEmail.mockResolvedValue({
        ...mockAccount,
        status: "suspended",
      })
      mockAccountService.verifyPassword.mockResolvedValue(true)

      await expect(
        service.signIn({ email: "admin@sable.tv", password: "TempPass123!" })
      ).rejects.toThrow(UnauthorizedException)
    })

    it("rejects admins without a role", async () => {
      mockAccountService.findByEmail.mockResolvedValue({
        ...mockAccount,
        adminRole: null,
      })
      mockAccountService.verifyPassword.mockResolvedValue(true)

      await expect(
        service.signIn({ email: "admin@sable.tv", password: "TempPass123!" })
      ).rejects.toThrow(ForbiddenException)
    })
  })

  describe("changePassword()", () => {
    it("updates password and clears must_change_password", async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        accountType: "admin",
        passwordHash: "salt:hash",
      })
      mockAccountService.verifyPassword.mockResolvedValue(true)
      mockAccountService.hashPassword.mockResolvedValue("salt:newhash")

      await service.changePassword("acc_admin_1", {
        currentPassword: "old-pass",
        newPassword: "new-pass-123",
      })

      expect(mockPrisma.account.update).toHaveBeenCalledWith({
        where: { id: "acc_admin_1" },
        data: {
          passwordHash: "salt:newhash",
          mustChangePassword: false,
        },
      })
    })

    it("rejects non-admin accounts", async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        accountType: "creator",
        passwordHash: "salt:hash",
      })

      await expect(
        service.changePassword("acc_creator_1", {
          currentPassword: "old-pass",
          newPassword: "new-pass-123",
        })
      ).rejects.toThrow(ForbiddenException)
    })

    it("rejects incorrect current password", async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        accountType: "admin",
        passwordHash: "salt:hash",
      })
      mockAccountService.verifyPassword.mockResolvedValue(false)

      await expect(
        service.changePassword("acc_admin_1", {
          currentPassword: "wrong",
          newPassword: "new-pass-123",
        })
      ).rejects.toThrow(UnauthorizedException)
    })

    it("rejects identical passwords", async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        accountType: "admin",
        passwordHash: "salt:hash",
      })
      mockAccountService.verifyPassword.mockResolvedValue(true)

      await expect(
        service.changePassword("acc_admin_1", {
          currentPassword: "same-pass",
          newPassword: "same-pass",
        })
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe("getSession()", () => {
    it("returns admin session metadata", async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        accountType: "admin",
        email: "admin@sable.tv",
        displayName: "Ada Obi",
        mustChangePassword: false,
        adminRole: "super_admin",
        status: "active",
      })

      const result = await service.getSession("acc_admin_1")

      expect(result).toEqual({
        role: AdminRole.SUPER_ADMIN,
        must_change_password: false,
        admin: {
          id: "acc_admin_1",
          email: "admin@sable.tv",
          display_name: "Ada Obi",
        },
      })
    })

    it("rejects non-admin accounts", async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        accountType: "creator",
        email: "creator@sable.tv",
        displayName: null,
        mustChangePassword: false,
        adminRole: null,
        status: "active",
      })

      await expect(service.getSession("acc_creator_1")).rejects.toThrow(
        ForbiddenException
      )
    })
  })
})
