jest.mock("@sable/logger", () => ({
  CustomLogger: class CustomLogger {
    log() {}
    error() {}
    warn() {}
    debug() {}
  },
}))

import { ConflictException, NotFoundException } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import type { AccountService } from "../auth/account.service"
import type { EmailService } from "../email/email.service"
import { AdminOnboardingService } from "./admin-onboarding.service"

function makeAppRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "acc_creator_1",
    accountType: "creator",
    email: "tunde@email.com",
    displayName: null,
    firstName: "Tunde",
    lastName: "Bakare",
    bio: "Director.",
    status: "pending_approval",
    createdAt: new Date("2026-07-10T00:00:00.000Z"),
    onboardingReviewedAt: null,
    onboardingReviewNote: null,
    creatorProfile: { handle: "tundeshoots" },
    ...overrides,
  }
}

function makeInviteRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "inv_1",
    email: "fola@futurefilms.co",
    emailNormalized: "fola@futurefilms.co",
    firstName: "Fola",
    lastName: null,
    note: null,
    token: "tok",
    status: "sent",
    invitedById: "admin_1",
    acceptedAt: null,
    expiresAt: new Date(Date.now() + 1000),
    createdAt: new Date("2026-07-16T00:00:00.000Z"),
    updatedAt: new Date("2026-07-16T00:00:00.000Z"),
    invitedBy: { displayName: "Admin", email: "admin@sable.tv" },
    ...overrides,
  }
}

describe("AdminOnboardingService", () => {
  let service: AdminOnboardingService
  let prisma: {
    account: {
      findUnique: jest.Mock
      findMany: jest.Mock
      count: jest.Mock
      update: jest.Mock
    }
    creatorInvite: {
      findUnique: jest.Mock
      findFirst: jest.Mock
      findMany: jest.Mock
      count: jest.Mock
      create: jest.Mock
      update: jest.Mock
    }
  }
  let accountService: { transitionStatus: jest.Mock }
  let email: { sendCreatorInvite: jest.Mock }
  let config: { get: jest.Mock }

  beforeEach(() => {
    prisma = {
      account: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
        update: jest.fn().mockResolvedValue({}),
      },
      creatorInvite: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn(),
        update: jest.fn(),
      },
    }
    accountService = { transitionStatus: jest.fn().mockResolvedValue({}) }
    email = { sendCreatorInvite: jest.fn().mockResolvedValue(undefined) }
    config = { get: jest.fn().mockReturnValue("http://localhost:3001") }

    service = new AdminOnboardingService(
      prisma as never,
      accountService as unknown as AccountService,
      email as unknown as EmailService,
      config as unknown as ConfigService
    )
  })

  describe("applications", () => {
    it("derives pending status and maps first/last name + initials", async () => {
      prisma.account.findMany.mockResolvedValue([makeAppRow()])

      const result = await service.listApplications({})

      expect(result.items[0]).toMatchObject({
        name: "Tunde Bakare",
        initials: "TB",
        username: "@tundeshoots",
        status: "pending",
      })
    })

    it("approve transitions to active and stamps review audit", async () => {
      prisma.account.findUnique.mockResolvedValue(makeAppRow())

      await service.approve("acc_creator_1", "admin_1")

      expect(accountService.transitionStatus).toHaveBeenCalledWith({
        account_id: "acc_creator_1",
        to: "active",
      })
      const data = prisma.account.update.mock.calls[0][0].data
      expect(data.onboardingReviewedById).toBe("admin_1")
      expect(data.onboardingReviewedAt).toBeInstanceOf(Date)
    })

    it("reject transitions to rejected and stores the note", async () => {
      prisma.account.findUnique.mockResolvedValue(makeAppRow())

      await service.reject("acc_creator_1", "admin_1", { note: "Not a fit" })

      expect(accountService.transitionStatus).toHaveBeenCalledWith({
        account_id: "acc_creator_1",
        to: "rejected",
      })
      expect(
        prisma.account.update.mock.calls[0][0].data.onboardingReviewNote
      ).toBe("Not a fit")
    })

    it("reopen transitions to pending_approval and clears audit", async () => {
      prisma.account.findUnique.mockResolvedValue(
        makeAppRow({ status: "rejected", onboardingReviewedAt: new Date() })
      )

      await service.reopen("acc_creator_1", "admin_1")

      expect(accountService.transitionStatus).toHaveBeenCalledWith({
        account_id: "acc_creator_1",
        to: "pending_approval",
      })
      expect(
        prisma.account.update.mock.calls[0][0].data.onboardingReviewedAt
      ).toBeNull()
    })

    it("throws when the application is not a creator", async () => {
      prisma.account.findUnique.mockResolvedValue(
        makeAppRow({ accountType: "admin" })
      )
      await expect(service.getApplication("x")).rejects.toBeInstanceOf(
        NotFoundException
      )
    })
  })

  describe("invites", () => {
    it("creates an invite, generates a token, and sends the email", async () => {
      prisma.account.findUnique.mockResolvedValue(null)
      prisma.creatorInvite.findFirst.mockResolvedValue(null)
      prisma.creatorInvite.create.mockResolvedValue(makeInviteRow())

      const result = await service.createInvite("admin_1", {
        email: "fola@futurefilms.co",
        firstName: "Fola",
      })

      const createData = prisma.creatorInvite.create.mock.calls[0][0].data
      expect(createData.token).toMatch(/^[a-f0-9]{64}$/)
      expect(createData.status).toBe("sent")
      expect(email.sendCreatorInvite).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "fola@futurefilms.co",
          acceptUrl: expect.stringContaining("/onboarding?invite="),
        })
      )
      expect(result.status).toBe("sent")
    })

    it("rejects a duplicate active invite", async () => {
      prisma.account.findUnique.mockResolvedValue(null)
      prisma.creatorInvite.findFirst.mockResolvedValue(makeInviteRow())

      await expect(
        service.createInvite("admin_1", { email: "fola@futurefilms.co" })
      ).rejects.toBeInstanceOf(ConflictException)
      expect(email.sendCreatorInvite).not.toHaveBeenCalled()
    })

    it("rejects when a creator account already exists", async () => {
      prisma.account.findUnique.mockResolvedValue({ id: "acc_existing" })

      await expect(
        service.createInvite("admin_1", { email: "fola@futurefilms.co" })
      ).rejects.toBeInstanceOf(ConflictException)
    })

    it("resend regenerates token/expiry and re-sends", async () => {
      prisma.creatorInvite.findUnique.mockResolvedValue(
        makeInviteRow({ status: "expired" })
      )
      prisma.creatorInvite.update.mockResolvedValue(
        makeInviteRow({ status: "sent" })
      )

      await service.resendInvite("inv_1")

      const data = prisma.creatorInvite.update.mock.calls[0][0].data
      expect(data.status).toBe("sent")
      expect(data.token).toMatch(/^[a-f0-9]{64}$/)
      expect(email.sendCreatorInvite).toHaveBeenCalled()
    })

    it("cannot resend an accepted invite", async () => {
      prisma.creatorInvite.findUnique.mockResolvedValue(
        makeInviteRow({ status: "accepted" })
      )

      await expect(service.resendInvite("inv_1")).rejects.toBeInstanceOf(
        ConflictException
      )
    })

    it("revoke sets status to revoked", async () => {
      prisma.creatorInvite.findUnique.mockResolvedValue(makeInviteRow())
      prisma.creatorInvite.update.mockResolvedValue(
        makeInviteRow({ status: "revoked" })
      )

      const result = await service.revokeInvite("inv_1")

      expect(prisma.creatorInvite.update.mock.calls[0][0].data.status).toBe(
        "revoked"
      )
      expect(result.status).toBe("revoked")
    })
  })
})
