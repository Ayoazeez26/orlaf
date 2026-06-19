import { BadRequestException } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { Test, TestingModule } from "@nestjs/testing"
import { AccountType } from "@sable/contracts"
import { DeletionService } from "./deletion.service"
import { RefreshTokenService } from "./refresh-token.service"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const activeUser = {
  id: "acc_user_1",
  accountType: "user" as const,
  email: "user@example.com",
  emailNormalized: "user@example.com",
  status: "active" as const,
  deletedAt: null,
  anonymizedAt: null,
  displayName: "Test User",
  avatarUrl: null,
  providerSubjectId: "google|123",
  provider: "google" as const,
  passwordHash: null,
  mustChangePassword: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockPrisma = {
  account: {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
  },
  deletionJob: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
  },
  $transaction: jest.fn((ops: any[]) => Promise.all(ops)),
}

const mockRefreshTokenService = {
  revokeAllForAccount: jest.fn().mockResolvedValue(2),
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("DeletionService", () => {
  let service: DeletionService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ ignoreEnvFile: true, load: [() => ({})] }),
      ],
      providers: [
        DeletionService,
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
      ],
    }).compile()

    const config = module.get("ConfigService" as any)
    service = new DeletionService(
      mockPrisma as any,
      mockRefreshTokenService as any,
      config
    )
  })

  // -------------------------------------------------------------------------
  // initiateAccountDeletion
  // -------------------------------------------------------------------------

  describe("initiateAccountDeletion()", () => {
    it("sets status to pending_deletion and schedules job", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue(activeUser)
      mockPrisma.account.update.mockResolvedValue({
        ...activeUser,
        status: "pending_deletion",
      })
      mockPrisma.deletionJob.upsert.mockResolvedValue({})
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )

      await service.initiateAccountDeletion("acc_user_1", AccountType.USER)

      expect(mockPrisma.$transaction).toHaveBeenCalled()
      expect(mockRefreshTokenService.revokeAllForAccount).toHaveBeenCalledWith(
        "acc_user_1"
      )
    })

    it("schedules deletion job 30 days from now", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue(activeUser)
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )
      mockPrisma.account.update.mockResolvedValue({})
      mockPrisma.deletionJob.upsert.mockImplementation(({ create }: any) => {
        const diffDays =
          (create.runAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        expect(diffDays).toBeCloseTo(30, 0)
        return Promise.resolve({})
      })

      await service.initiateAccountDeletion("acc_user_1", AccountType.USER)
    })

    it("rejects creator accounts with 400", async () => {
      await expect(
        service.initiateAccountDeletion("acc_creator_1", AccountType.CREATOR)
      ).rejects.toThrow(BadRequestException)

      expect(mockPrisma.account.findUniqueOrThrow).not.toHaveBeenCalled()
    })

    it("rejects admin accounts with 400", async () => {
      await expect(
        service.initiateAccountDeletion("acc_admin_1", AccountType.ADMIN)
      ).rejects.toThrow(BadRequestException)
    })

    it("is idempotent — already pending_deletion is a no-op", async () => {
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue({
        ...activeUser,
        status: "pending_deletion",
      })

      await expect(
        service.initiateAccountDeletion("acc_user_1", AccountType.USER)
      ).resolves.not.toThrow()

      expect(mockPrisma.$transaction).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // restoreAccountIfPendingDeletion
  // -------------------------------------------------------------------------

  describe("restoreAccountIfPendingDeletion()", () => {
    it("restores a pending_deletion account to active", async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        ...activeUser,
        status: "pending_deletion",
        deletedAt: new Date(),
      })
      mockPrisma.account.update.mockResolvedValue({
        ...activeUser,
        status: "active",
      })
      mockPrisma.deletionJob.deleteMany.mockResolvedValue({ count: 1 })
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )

      const result = await service.restoreAccountIfPendingDeletion("acc_user_1")

      expect(result.restored).toBe(true)
      expect(mockPrisma.$transaction).toHaveBeenCalled()
    })

    it("returns restored=false for an active account", async () => {
      mockPrisma.account.findUnique.mockResolvedValue(activeUser)

      const result = await service.restoreAccountIfPendingDeletion("acc_user_1")
      expect(result.restored).toBe(false)
    })

    it("returns restored=false when account not found", async () => {
      mockPrisma.account.findUnique.mockResolvedValue(null)

      const result =
        await service.restoreAccountIfPendingDeletion("nonexistent")
      expect(result.restored).toBe(false)
    })

    it("removes the deletion_jobs row on restore", async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        ...activeUser,
        status: "pending_deletion",
      })
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )
      mockPrisma.account.update.mockResolvedValue({})
      mockPrisma.deletionJob.deleteMany.mockResolvedValue({ count: 1 })

      await service.restoreAccountIfPendingDeletion("acc_user_1")

      expect(mockPrisma.deletionJob.deleteMany).toHaveBeenCalledWith({
        where: { accountId: "acc_user_1" },
      })
    })
  })

  // -------------------------------------------------------------------------
  // processDueDeletionsNow — anonymization job
  // -------------------------------------------------------------------------

  describe("processDueDeletionsNow()", () => {
    const pendingJob = {
      id: "job_1",
      accountId: "acc_user_1",
      runAt: new Date(Date.now() - 1000),
      createdAt: new Date(),
      account: { ...activeUser, status: "pending_deletion" as const },
    }

    it("anonymizes due accounts", async () => {
      mockPrisma.deletionJob.findMany.mockResolvedValue([pendingJob])
      mockPrisma.account.update.mockResolvedValue({})
      mockPrisma.deletionJob.delete.mockResolvedValue({})
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )

      const result = await service.processDueDeletionsNow()

      expect(result.succeeded).toBe(1)
      expect(result.failed).toBe(0)
    })

    it("clears PII fields on anonymization", async () => {
      mockPrisma.deletionJob.findMany.mockResolvedValue([pendingJob])
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )
      mockPrisma.account.update.mockImplementation(({ data }: any) => {
        expect(data.status).toBe("deleted")
        expect(data.displayName).toBeNull()
        expect(data.providerSubjectId).toBeNull()
        expect(data.email).toMatch(/deleted\+.+@deleted\.local/)
        expect(data.anonymizedAt).toBeInstanceOf(Date)
        return Promise.resolve({})
      })
      mockPrisma.deletionJob.delete.mockResolvedValue({})

      await service.processDueDeletionsNow()
    })

    it("is idempotent — already anonymized accounts are skipped", async () => {
      mockPrisma.deletionJob.findMany.mockResolvedValue([
        {
          ...pendingJob,
          account: {
            ...activeUser,
            status: "deleted" as const,
            anonymizedAt: new Date(), // already done
          },
        },
      ])
      mockPrisma.deletionJob.deleteMany.mockResolvedValue({ count: 1 })

      const result = await service.processDueDeletionsNow()

      expect(result.succeeded).toBe(1)
      expect(mockPrisma.account.update).not.toHaveBeenCalled()
    })

    it("continues processing remaining jobs when one fails", async () => {
      const secondJob = {
        id: "job_2",
        accountId: "acc_user_2",
        runAt: new Date(Date.now() - 1000),
        createdAt: new Date(),
        account: {
          ...activeUser,
          id: "acc_user_2",
          status: "pending_deletion" as const,
        },
      }

      mockPrisma.deletionJob.findMany.mockResolvedValue([pendingJob, secondJob])
      mockPrisma.$transaction
        .mockRejectedValueOnce(new Error("DB error on first"))
        .mockImplementationOnce((ops: any[]) => Promise.all(ops))
      mockPrisma.account.update.mockResolvedValue({})
      mockPrisma.deletionJob.delete.mockResolvedValue({})

      const result = await service.processDueDeletionsNow()

      expect(result.failed).toBe(1)
      expect(result.succeeded).toBe(1)
    })

    it("returns zero counts when no jobs are due", async () => {
      mockPrisma.deletionJob.findMany.mockResolvedValue([])

      const result = await service.processDueDeletionsNow()
      expect(result.succeeded).toBe(0)
      expect(result.failed).toBe(0)
    })
  })

  // -------------------------------------------------------------------------
  // Integration: delete → advance clock → anonymize → re-signup allowed
  // -------------------------------------------------------------------------

  describe("end-to-end flow", () => {
    it("allows re-signup with same email after anonymization", async () => {
      // Step 1: delete
      mockPrisma.account.findUniqueOrThrow.mockResolvedValue(activeUser)
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )
      mockPrisma.account.update.mockResolvedValue({})
      mockPrisma.deletionJob.upsert.mockResolvedValue({})

      await service.initiateAccountDeletion("acc_user_1", AccountType.USER)

      // Step 2: advance past 30 days (mock findMany returns job with past runAt)
      const pastJob = {
        id: "job_1",
        accountId: "acc_user_1",
        runAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        account: { ...activeUser, status: "pending_deletion" as const },
      }
      mockPrisma.deletionJob.findMany.mockResolvedValue([pastJob])
      mockPrisma.deletionJob.delete.mockResolvedValue({})

      const result = await service.processDueDeletionsNow()
      expect(result.succeeded).toBe(1)

      // Step 3: original email is now cleared — emailNormalized is deleted+<id>@deleted.local
      // A new account with user@example.com can be created
      // This is enforced at DB level by the unique constraint no longer holding
      // the original email. We verify the update cleared the email:
      const updateCall = mockPrisma.account.update.mock.calls.find(
        ([args]: any) => args?.data?.email?.includes("@deleted.local")
      )
      expect(updateCall).toBeDefined()
    })
  })
})
