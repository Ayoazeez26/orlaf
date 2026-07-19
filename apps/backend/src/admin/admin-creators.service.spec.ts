import { NotFoundException } from "@nestjs/common"
import type { AccountService } from "../auth/account.service"
import { AdminCreatorsService } from "./admin-creators.service"

function makeRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "acc_creator_1",
    accountType: "creator",
    email: "adaeze@email.com",
    displayName: "Adaeze Okafor",
    firstName: null,
    lastName: null,
    bio: "Vertical drama creator.",
    status: "active",
    createdAt: new Date("2026-07-01T00:00:00.000Z"),
    suspendedAt: null,
    suspendedUntil: null,
    suspendReason: null,
    creatorProfile: {
      handle: "lucid_productions",
      studioName: "Lucid",
      creatorType: "studio",
      isVerified: false,
      verifiedAt: null,
    },
    ...overrides,
  }
}

describe("AdminCreatorsService", () => {
  let service: AdminCreatorsService
  let prisma: {
    account: {
      findUnique: jest.Mock
      findMany: jest.Mock
      count: jest.Mock
      update: jest.Mock
    }
    creatorProfile: { upsert: jest.Mock }
  }
  let accountService: { transitionStatus: jest.Mock }

  beforeEach(() => {
    prisma = {
      account: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
      creatorProfile: { upsert: jest.fn() },
    }
    accountService = { transitionStatus: jest.fn() }
    service = new AdminCreatorsService(
      prisma as never,
      accountService as unknown as AccountService
    )
  })

  describe("list()", () => {
    it("maps rows and returns stats + pagination", async () => {
      prisma.account.findMany.mockResolvedValue([makeRow()])
      prisma.account.count
        .mockResolvedValueOnce(1) // total for where
        .mockResolvedValueOnce(1) // stats total
        .mockResolvedValueOnce(1) // stats active
        .mockResolvedValueOnce(0) // stats suspended
        .mockResolvedValueOnce(1) // stats newThisMonth

      const result = await service.list({ page: 1, pageSize: 20 })

      expect(result.items).toHaveLength(1)
      expect(result.items[0]).toMatchObject({
        id: "acc_creator_1",
        name: "Adaeze Okafor",
        username: "@lucid_productions",
        initials: "AO",
        status: "active",
        isVerified: false,
      })
      expect(result.stats).toEqual({
        total: 1,
        active: 1,
        suspended: 0,
        newThisMonth: 1,
      })
    })

    it("strips the leading @ from a handle-style displayName", async () => {
      prisma.account.findMany.mockResolvedValue([
        makeRow({
          displayName: "@adeola.c",
          firstName: null,
          lastName: null,
          creatorProfile: null,
        }),
      ])
      prisma.account.count.mockResolvedValue(0)

      const result = await service.list({})

      expect(result.items[0].name).toBe("adeola.c")
      expect(result.items[0].initials).toBe("AC")
    })

    it("prefers first + last name for initials", async () => {
      prisma.account.findMany.mockResolvedValue([
        makeRow({
          displayName: "@adeola.c",
          firstName: "Adeola",
          lastName: "Chen",
        }),
      ])
      prisma.account.count.mockResolvedValue(0)

      const result = await service.list({})

      expect(result.items[0].name).toBe("Adeola Chen")
      expect(result.items[0].initials).toBe("AC")
    })

    it("filters by suspended status", async () => {
      prisma.account.findMany.mockResolvedValue([])
      prisma.account.count.mockResolvedValue(0)

      await service.list({ filter: "suspended" })

      const where = prisma.account.findMany.mock.calls[0][0].where
      expect(where.status).toBe("suspended")
    })
  })

  describe("getById()", () => {
    it("throws when the account is not a creator", async () => {
      prisma.account.findUnique.mockResolvedValue(
        makeRow({ accountType: "admin" })
      )

      await expect(service.getById("acc_creator_1")).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it("throws when the account does not exist", async () => {
      prisma.account.findUnique.mockResolvedValue(null)

      await expect(service.getById("missing")).rejects.toBeInstanceOf(
        NotFoundException
      )
    })
  })

  describe("verify()", () => {
    it("upserts the verified badge and returns detail", async () => {
      prisma.account.findUnique.mockResolvedValue(makeRow())
      prisma.creatorProfile.upsert.mockResolvedValue({})

      await service.verify("acc_creator_1", "admin_1", {})

      expect(prisma.creatorProfile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { accountId: "acc_creator_1" },
          update: expect.objectContaining({
            isVerified: true,
            verifiedById: "admin_1",
          }),
        })
      )
    })
  })

  describe("suspend()", () => {
    it("transitions status and stores suspend metadata with an expiry", async () => {
      prisma.account.findUnique.mockResolvedValue(makeRow())
      accountService.transitionStatus.mockResolvedValue({})
      prisma.account.update.mockResolvedValue({})

      await service.suspend("acc_creator_1", "admin_1", {
        duration: "7d",
        reason: "Policy violation",
      })

      expect(accountService.transitionStatus).toHaveBeenCalledWith({
        account_id: "acc_creator_1",
        to: "suspended",
      })

      const updateData = prisma.account.update.mock.calls[0][0].data
      expect(updateData.suspendReason).toBe("Policy violation")
      expect(updateData.suspendedById).toBe("admin_1")
      expect(updateData.suspendedUntil).toBeInstanceOf(Date)
    })

    it("stores no expiry for permanent suspensions", async () => {
      prisma.account.findUnique.mockResolvedValue(makeRow())
      accountService.transitionStatus.mockResolvedValue({})
      prisma.account.update.mockResolvedValue({})

      await service.suspend("acc_creator_1", "admin_1", {
        duration: "permanent",
      })

      const updateData = prisma.account.update.mock.calls[0][0].data
      expect(updateData.suspendedUntil).toBeNull()
    })
  })

  describe("reactivate()", () => {
    it("transitions to active and clears suspend metadata", async () => {
      prisma.account.findUnique.mockResolvedValue(
        makeRow({ status: "suspended" })
      )
      accountService.transitionStatus.mockResolvedValue({})
      prisma.account.update.mockResolvedValue({})

      await service.reactivate("acc_creator_1", "admin_1")

      expect(accountService.transitionStatus).toHaveBeenCalledWith({
        account_id: "acc_creator_1",
        to: "active",
      })
      const updateData = prisma.account.update.mock.calls[0][0].data
      expect(updateData.suspendedUntil).toBeNull()
      expect(updateData.suspendReason).toBeNull()
    })
  })
})
