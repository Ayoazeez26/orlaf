import { BadRequestException, NotFoundException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { PrismaService } from "../prisma/prisma.service"
import { CreatorInvitesService } from "./creator-invites.service"

describe("CreatorInvitesService", () => {
  let service: CreatorInvitesService
  let prisma: {
    creatorInvite: {
      findUnique: jest.Mock
      findFirst: jest.Mock
      update: jest.Mock
    }
  }

  const validInvite = {
    id: "inv_1",
    email: "fola@futurefilms.co",
    emailNormalized: "fola@futurefilms.co",
    firstName: "Fola",
    lastName: "Ade",
    note: "Welcome aboard",
    token: "abc123",
    status: "sent" as const,
    invitedById: "admin_1",
    acceptedAt: null,
    expiresAt: new Date(Date.now() + 60_000),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    prisma = {
      creatorInvite: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatorInvitesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile()

    service = module.get(CreatorInvitesService)
  })

  it("returns invite details for a valid token", async () => {
    prisma.creatorInvite.findUnique.mockResolvedValue(validInvite)

    await expect(service.validateByToken("abc123")).resolves.toEqual({
      valid: true,
      status: "sent",
      email: "fola@futurefilms.co",
      firstName: "Fola",
      lastName: "Ade",
      note: "Welcome aboard",
    })
  })

  it("rejects signup when email does not match invite", async () => {
    prisma.creatorInvite.findUnique.mockResolvedValue(validInvite)

    await expect(
      service.assertValidForSignup("abc123", "other@example.com")
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  it("accepts invite after email verification", async () => {
    prisma.creatorInvite.findUnique.mockResolvedValue(validInvite)
    prisma.creatorInvite.update.mockResolvedValue({
      ...validInvite,
      status: "accepted",
    })

    await service.acceptByToken("abc123", "fola@futurefilms.co")

    expect(prisma.creatorInvite.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "inv_1" },
        data: expect.objectContaining({ status: "accepted" }),
      })
    )
  })

  it("throws when invite token is unknown", async () => {
    prisma.creatorInvite.findUnique.mockResolvedValue(null)

    await expect(service.validateByToken("missing")).rejects.toBeInstanceOf(
      NotFoundException
    )
  })

  it("detects accepted invites by email", async () => {
    prisma.creatorInvite.findFirst.mockResolvedValue({ id: "inv_1" })

    await expect(
      service.hasAcceptedInvite("fola@futurefilms.co")
    ).resolves.toBe(true)
  })
})
