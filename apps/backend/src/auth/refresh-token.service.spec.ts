import { createHash } from "node:crypto"
import { UnauthorizedException } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { Test, TestingModule } from "@nestjs/testing"
import { RefreshTokenService } from "./refresh-token.service"

// ---------------------------------------------------------------------------
// Prisma mock
// We mock PrismaClient entirely — no DB needed in unit tests.
// ---------------------------------------------------------------------------

const mockToken = {
  id: "tok_1",
  accountId: "acc_abc",
  tokenHash: "", // filled per test
  parentId: null,
  issuedAt: new Date(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  revokedAt: null,
  lastUsedAt: null,
  deviceLabel: null,
}

const mockPrisma = {
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  $transaction: jest.fn((ops: any[]) => Promise.all(ops)),
}

describe("RefreshTokenService", () => {
  let service: RefreshTokenService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [() => ({ JWT_REFRESH_EXPIRES_IN: "2592000" })],
        }),
      ],
      providers: [
        RefreshTokenService,
        { provide: "PrismaClient", useValue: mockPrisma },
      ],
    })
      .overrideProvider(RefreshTokenService)
      .useFactory({
        factory: (config: any) =>
          new RefreshTokenService(mockPrisma as any, config),
        inject: ["ConfigService"],
      })
      .compile()

    // Instantiate directly so we can inject the mock prisma cleanly
    const config = module.get("ConfigService" as any)
    service = new RefreshTokenService(mockPrisma as any, config)
  })

  // -------------------------------------------------------------------------
  // issueRefreshToken
  // -------------------------------------------------------------------------

  describe("issueRefreshToken()", () => {
    it("returns a 64-char hex string (256 bits)", async () => {
      mockPrisma.refreshToken.create.mockResolvedValue({})

      const token = await service.issueRefreshToken({ account_id: "acc_1" })

      expect(token).toMatch(/^[a-f0-9]{64}$/)
    })

    it("stores only the hash — not the raw token", async () => {
      mockPrisma.refreshToken.create.mockResolvedValue({})

      const token = await service.issueRefreshToken({ account_id: "acc_1" })
      const { data } = mockPrisma.refreshToken.create.mock.calls[0][0]

      expect(data.tokenHash).not.toBe(token)
      expect(data.tokenHash).toHaveLength(64) // sha256 hex
    })
  })

  // -------------------------------------------------------------------------
  // rotateRefreshToken — happy path
  // -------------------------------------------------------------------------

  describe("rotateRefreshToken() — happy path", () => {
    it("revokes the old token and returns a new one", async () => {
      const rawToken = "a".repeat(64)
      const hash = createHash("sha256").update(rawToken).digest("hex")

      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        ...mockToken,
        tokenHash: hash,
      })
      mockPrisma.refreshToken.update.mockResolvedValue({})
      mockPrisma.refreshToken.create.mockResolvedValue({})
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )

      const result = await service.rotateRefreshToken(rawToken)

      expect(result.newRefreshToken).toMatch(/^[a-f0-9]{64}$/)
      expect(result.newRefreshToken).not.toBe(rawToken)
      expect(result.accountId).toBe("acc_abc")
    })

    it("sets parentId on the new token to the old token id", async () => {
      const rawToken = "b".repeat(64)
      const hash = createHash("sha256").update(rawToken).digest("hex")

      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        ...mockToken,
        id: "tok_parent",
        tokenHash: hash,
      })
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )

      await service.rotateRefreshToken(rawToken)

      // Second op in the transaction is the create
      const createCall = mockPrisma.refreshToken.create.mock.calls[0][0]
      expect(createCall.data.parentId).toBe("tok_parent")
    })
  })

  // -------------------------------------------------------------------------
  // rotateRefreshToken — reuse detection
  // -------------------------------------------------------------------------

  describe("rotateRefreshToken() — reuse detection", () => {
    it("throws 401 and revokes chain when token is already revoked", async () => {
      const rawToken = "c".repeat(64)
      const hash = createHash("sha256").update(rawToken).digest("hex")

      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        ...mockToken,
        tokenHash: hash,
        revokedAt: new Date(Date.now() - 1000), // already revoked
      })
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 })
      mockPrisma.refreshToken.findMany.mockResolvedValue([]) // no children

      await expect(service.rotateRefreshToken(rawToken)).rejects.toThrow(
        UnauthorizedException
      )

      // Chain revocation must have been called
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalled()
    })

    it("throws 401 for an unknown token", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null)

      await expect(service.rotateRefreshToken("unknown")).rejects.toThrow(
        UnauthorizedException
      )
    })
  })

  // -------------------------------------------------------------------------
  // rotateRefreshToken — expired token
  // -------------------------------------------------------------------------

  describe("rotateRefreshToken() — expired token", () => {
    it("throws 401 for an expired token", async () => {
      const rawToken = "d".repeat(64)
      const hash = createHash("sha256").update(rawToken).digest("hex")

      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        ...mockToken,
        tokenHash: hash,
        expiresAt: new Date(Date.now() - 1000), // expired
        revokedAt: null,
      })
      mockPrisma.refreshToken.update.mockResolvedValue({})

      await expect(service.rotateRefreshToken(rawToken)).rejects.toThrow(
        UnauthorizedException
      )
    })
  })

  // -------------------------------------------------------------------------
  // revokeByToken
  // -------------------------------------------------------------------------

  describe("revokeByToken()", () => {
    it("marks the token as revoked", async () => {
      const rawToken = "e".repeat(64)
      const hash = createHash("sha256").update(rawToken).digest("hex")

      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        ...mockToken,
        tokenHash: hash,
      })
      mockPrisma.refreshToken.update.mockResolvedValue({})

      await service.revokeByToken(rawToken)

      expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockToken.id },
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        })
      )
    })

    it("is a no-op for an unknown token", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null)

      await expect(service.revokeByToken("nonexistent")).resolves.not.toThrow()
      expect(mockPrisma.refreshToken.update).not.toHaveBeenCalled()
    })
  })
})
