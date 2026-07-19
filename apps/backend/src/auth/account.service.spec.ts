import { BadRequestException, ConflictException } from "@nestjs/common"
import { AdminRole } from "@sable/contracts"
import type { PrismaService } from "../prisma/prisma.service"
import { AccountService } from "./account.service"

// ---------------------------------------------------------------------------
// Prisma mock
// ---------------------------------------------------------------------------

const mockAccount = {
  id: "acc_1",
  accountType: "user" as const,
  email: "user@example.com",
  emailNormalized: "user@example.com",
  provider: null,
  providerSubjectId: null,
  passwordHash: null,
  mustChangePassword: false,
  displayName: null,
  avatarUrl: null,
  status: "active" as const,
  deletedAt: null,
  anonymizedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockPrisma = {
  account: {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}

describe("AccountService", () => {
  let service: AccountService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new AccountService(mockPrisma as unknown as PrismaService)
  })

  // -------------------------------------------------------------------------
  // createAdmin
  // -------------------------------------------------------------------------

  describe("createAdmin()", () => {
    it("creates an admin with mustChangePassword=true", async () => {
      mockPrisma.account.findUnique.mockResolvedValue(null)
      mockPrisma.account.create.mockResolvedValue({
        ...mockAccount,
        accountType: "admin",
        mustChangePassword: true,
      })

      const result = await service.createAdmin({
        email: "admin@example.com",
        role: AdminRole.CONTENT_ADMIN,
      })

      expect(result.mustChangePassword).toBe(true)
      expect(mockPrisma.account.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            accountType: "admin",
            adminRole: "content_admin",
            mustChangePassword: true,
            passwordHash: expect.any(String),
          }),
        })
      )
    })

    it("throws ConflictException if admin email already exists", async () => {
      mockPrisma.account.findUnique.mockResolvedValue(mockAccount)

      await expect(
        service.createAdmin({
          email: "admin@example.com",
          role: AdminRole.CONTENT_ADMIN,
        })
      ).rejects.toThrow(ConflictException)
    })

    it("stores a hashed password — not plaintext", async () => {
      mockPrisma.account.findUnique.mockResolvedValue(null)
      mockPrisma.account.create.mockImplementation(
        ({ data }: { data: Partial<typeof mockAccount> }) =>
          Promise.resolve({ ...mockAccount, ...data })
      )

      await service.createAdmin({
        email: "admin2@example.com",
        role: AdminRole.SUPER_ADMIN,
      })

      const { passwordHash } = mockPrisma.account.create.mock.calls[0][0].data
      expect(passwordHash).toContain(":") // salt:hash format
      expect(passwordHash).not.toBe("")
    })

    it("persists the requested admin role", async () => {
      mockPrisma.account.findUnique.mockResolvedValue(null)
      mockPrisma.account.create.mockResolvedValue({
        ...mockAccount,
        accountType: "admin",
        adminRole: "super_admin",
      })

      await service.createAdmin({
        email: "super@sable.tv",
        role: AdminRole.SUPER_ADMIN,
        password: "TempPass123!",
      })

      expect(mockPrisma.account.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            adminRole: "super_admin",
          }),
        })
      )
    })
  })

  // -------------------------------------------------------------------------
  // User transitions
  // -------------------------------------------------------------------------

  describe("user status transitions", () => {
    it("active → pending_deletion", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...mockAccount,
        status: "active",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...mockAccount,
        status: "pending_deletion",
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "pending_deletion",
      })
      expect(result.status).toBe("pending_deletion")
    })

    it("pending_deletion → active (grace period restore)", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...mockAccount,
        status: "pending_deletion",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...mockAccount,
        status: "active",
        deletedAt: null,
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "active",
      })
      expect(result.status).toBe("active")
    })

    it("pending_deletion → deleted", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...mockAccount,
        status: "pending_deletion",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...mockAccount,
        status: "deleted",
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "deleted",
      })
      expect(result.status).toBe("deleted")
    })

    it("rejects active → suspended for user", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...mockAccount,
        status: "active",
      })

      await expect(
        service.transitionStatus({ account_id: "acc_1", to: "suspended" })
      ).rejects.toThrow(BadRequestException)
    })
  })

  // -------------------------------------------------------------------------
  // Creator transitions
  // -------------------------------------------------------------------------

  describe("creator status transitions", () => {
    const creator = { ...mockAccount, accountType: "creator" as const }

    it("onboarding → active", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...creator,
        status: "onboarding",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...creator,
        status: "active",
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "active",
      })
      expect(result.status).toBe("active")
    })

    it("onboarding → pending_approval", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...creator,
        status: "onboarding",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...creator,
        status: "pending_approval",
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "pending_approval",
      })
      expect(result.status).toBe("pending_approval")
    })

    it("pending_approval → active", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...creator,
        status: "pending_approval",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...creator,
        status: "active",
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "active",
      })
      expect(result.status).toBe("active")
    })

    it("pending_approval → rejected", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...creator,
        status: "pending_approval",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...creator,
        status: "rejected",
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "rejected",
      })
      expect(result.status).toBe("rejected")
    })

    it("active → suspended", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...creator,
        status: "active",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...creator,
        status: "suspended",
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "suspended",
      })
      expect(result.status).toBe("suspended")
    })

    it("rejected → pending_approval (re-application)", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...creator,
        status: "rejected",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...creator,
        status: "pending_approval",
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "pending_approval",
      })
      expect(result.status).toBe("pending_approval")
    })

    it("rejects invalid onboarding transitions", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...creator,
        status: "onboarding",
      })

      await expect(
        service.transitionStatus({ account_id: "acc_1", to: "suspended" })
      ).rejects.toThrow(BadRequestException)
    })
  })

  // -------------------------------------------------------------------------
  // Admin transitions
  // -------------------------------------------------------------------------

  describe("admin status transitions", () => {
    const admin = { ...mockAccount, accountType: "admin" as const }

    it("active → suspended", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...admin,
        status: "active",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...admin,
        status: "suspended",
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "suspended",
      })
      expect(result.status).toBe("suspended")
    })

    it("suspended → active", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...admin,
        status: "suspended",
      })
      mockPrisma.account.update.mockResolvedValue({
        ...admin,
        status: "active",
      })

      const result = await service.transitionStatus({
        account_id: "acc_1",
        to: "active",
      })
      expect(result.status).toBe("active")
    })

    it("rejects active → pending_deletion for admin", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...admin,
        status: "active",
      })

      await expect(
        service.transitionStatus({
          account_id: "acc_1",
          to: "pending_deletion",
        })
      ).rejects.toThrow(BadRequestException)
    })
  })

  // -------------------------------------------------------------------------
  // Email normalisation
  // -------------------------------------------------------------------------

  describe("normalizeEmail()", () => {
    it("lowercases and trims", () => {
      expect(service.normalizeEmail("  User@Example.COM  ")).toBe(
        "user@example.com"
      )
    })
  })

  // -------------------------------------------------------------------------
  // Cross-type uniqueness (same email, different account types)
  // -------------------------------------------------------------------------

  describe("cross-type email allowance", () => {
    it("allows same email for user and creator (different account types)", async () => {
      // Both findUnique calls return null — no conflict
      mockPrisma.account.findUnique.mockResolvedValue(null)
      mockPrisma.account.create.mockResolvedValue({
        ...mockAccount,
        accountType: "creator",
      })

      // Should not throw — uniqueness is per account_type
      await expect(
        service.createAdmin({
          email: "new@example.com",
          role: AdminRole.CONTENT_ADMIN,
        })
      ).resolves.not.toThrow()
    })
  })

  // -------------------------------------------------------------------------
  // Password helpers
  // -------------------------------------------------------------------------

  describe("hashPassword / verifyPassword", () => {
    it("verifies a correct password", async () => {
      const hash = await service.hashPassword("secret123")
      expect(await service.verifyPassword("secret123", hash)).toBe(true)
    })

    it("rejects a wrong password", async () => {
      const hash = await service.hashPassword("secret123")
      expect(await service.verifyPassword("wrongpass", hash)).toBe(false)
    })
  })
})
