import { BadRequestException, ForbiddenException } from "@nestjs/common"
import { AccountType } from "@sable/contracts"
import { ConsentGuard } from "./consent.guard"
import { ConsentService } from "./consent.service"
import { CURRENT_POLICY_VERSIONS } from "./policies.config"

// ---------------------------------------------------------------------------
// Prisma mock
// ---------------------------------------------------------------------------

const mockPrisma = {
  consentRecord: { create: jest.fn() },
  account: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn((ops: any[]) => Promise.all(ops)),
}

// ---------------------------------------------------------------------------
// ConsentService tests
// ---------------------------------------------------------------------------

describe("ConsentService", () => {
  let service: ConsentService

  beforeEach(async () => {
    jest.clearAllMocks()
    service = new ConsentService(mockPrisma as any)
  })

  // -------------------------------------------------------------------------
  // getCurrentPolicyVersions
  // -------------------------------------------------------------------------

  describe("getCurrentPolicyVersions()", () => {
    it("returns all four policy keys", () => {
      const versions = service.getCurrentPolicyVersions()
      expect(versions).toHaveProperty("terms")
      expect(versions).toHaveProperty("privacy")
      expect(versions).toHaveProperty("community_guidelines")
      expect(versions).toHaveProperty("payment")
    })

    it("matches CURRENT_POLICY_VERSIONS constant", () => {
      expect(service.getCurrentPolicyVersions()).toEqual(
        CURRENT_POLICY_VERSIONS
      )
    })
  })

  // -------------------------------------------------------------------------
  // recordConsent
  // -------------------------------------------------------------------------

  describe("recordConsent()", () => {
    const validVersions = {
      terms: "1.0.0",
      privacy: "1.0.0",
      community_guidelines: "1.0.0",
      payment: "1.0.0",
    }

    it("inserts a consent record and flips needs_consent to false", async () => {
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )
      mockPrisma.consentRecord.create.mockResolvedValue({})
      mockPrisma.account.update.mockResolvedValue({})

      await service.recordConsent({
        account_id: "acc_1",
        policy_versions: validVersions as any,
        client_ip: "1.2.3.4",
        user_agent: "SableApp/1.0",
      })

      expect(mockPrisma.$transaction).toHaveBeenCalled()
      expect(mockPrisma.consentRecord.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            accountId: "acc_1",
            policyVersions: validVersions,
            clientIp: "1.2.3.4",
            userAgent: "SableApp/1.0",
          }),
        })
      )
      expect(mockPrisma.account.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "acc_1" },
          data: { needsConsent: false },
        })
      )
    })

    it("throws 400 when a policy key is missing", async () => {
      await expect(
        service.recordConsent({
          account_id: "acc_1",
          policy_versions: { terms: "1.0.0", privacy: "1.0.0" } as any,
        })
      ).rejects.toThrow(BadRequestException)
    })

    it("includes missing keys in the 400 response", async () => {
      try {
        await service.recordConsent({
          account_id: "acc_1",
          policy_versions: { terms: "1.0.0" } as any,
        })
      } catch (err: any) {
        expect(err.response?.missing).toContain("privacy")
        expect(err.response?.missing).toContain("community_guidelines")
        expect(err.response?.missing).toContain("payment")
      }
    })
  })

  // -------------------------------------------------------------------------
  // accountNeedsConsent
  // -------------------------------------------------------------------------

  describe("accountNeedsConsent()", () => {
    it("returns true when needs_consent is true", async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ needsConsent: true })
      expect(await service.accountNeedsConsent("acc_1")).toBe(true)
    })

    it("returns false when needs_consent is false", async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ needsConsent: false })
      expect(await service.accountNeedsConsent("acc_1")).toBe(false)
    })

    it("returns false when account is not found", async () => {
      mockPrisma.account.findUnique.mockResolvedValue(null)
      expect(await service.accountNeedsConsent("nonexistent")).toBe(false)
    })
  })
})

// ---------------------------------------------------------------------------
// ConsentGuard tests
// ---------------------------------------------------------------------------

describe("ConsentGuard", () => {
  let guard: ConsentGuard
  let consentService: ConsentService

  function mockContext(user: any, _handlerMeta = false) {
    return {
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any
  }

  beforeEach(() => {
    jest.clearAllMocks()
    consentService = new ConsentService(mockPrisma as any)
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) }
    guard = new ConsentGuard(consentService, reflector as any)
  })

  it("blocks a user with needs_consent=true with 403", async () => {
    mockPrisma.account.findUnique.mockResolvedValue({ needsConsent: true })

    const user = { sub: "acc_1", account_type: AccountType.USER, role: null }

    await expect(guard.canActivate(mockContext(user))).rejects.toThrow(
      ForbiddenException
    )
  })

  it("returns error_code consent_required", async () => {
    mockPrisma.account.findUnique.mockResolvedValue({ needsConsent: true })
    const user = { sub: "acc_1", account_type: AccountType.USER, role: null }

    try {
      await guard.canActivate(mockContext(user))
    } catch (err: any) {
      expect(err.response?.error_code).toBe("consent_required")
    }
  })

  it("passes through a user with needs_consent=false", async () => {
    mockPrisma.account.findUnique.mockResolvedValue({ needsConsent: false })
    const user = { sub: "acc_1", account_type: AccountType.USER, role: null }

    await expect(guard.canActivate(mockContext(user))).resolves.toBe(true)
  })

  it("does not gate CREATOR accounts", async () => {
    const user = {
      sub: "acc_creator",
      account_type: AccountType.CREATOR,
      role: null,
    }
    await expect(guard.canActivate(mockContext(user))).resolves.toBe(true)
    expect(mockPrisma.account.findUnique).not.toHaveBeenCalled()
  })

  it("does not gate ADMIN accounts", async () => {
    const user = {
      sub: "acc_admin",
      account_type: AccountType.ADMIN,
      role: null,
    }
    await expect(guard.canActivate(mockContext(user))).resolves.toBe(true)
    expect(mockPrisma.account.findUnique).not.toHaveBeenCalled()
  })

  it("skips gate when SkipConsent metadata is set", async () => {
    mockPrisma.account.findUnique.mockResolvedValue({ needsConsent: true })
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(true) } // skip=true
    const skipGuard = new ConsentGuard(consentService, reflector as any)
    const user = { sub: "acc_1", account_type: AccountType.USER, role: null }

    await expect(skipGuard.canActivate(mockContext(user))).resolves.toBe(true)
    expect(mockPrisma.account.findUnique).not.toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // Integration: new user → 403 → consent → 200
  // -------------------------------------------------------------------------

  describe("end-to-end consent flow", () => {
    it("new user is blocked, records consent, then passes through", async () => {
      const consentSvc = new ConsentService(mockPrisma as any)
      const reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) }
      const testGuard = new ConsentGuard(consentSvc, reflector as any)
      const user = {
        sub: "acc_new",
        account_type: AccountType.USER,
        role: null,
      }

      // Step 1: new user — needs_consent=true → 403
      mockPrisma.account.findUnique.mockResolvedValue({ needsConsent: true })
      await expect(testGuard.canActivate(mockContext(user))).rejects.toThrow(
        ForbiddenException
      )

      // Step 2: record consent
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )
      mockPrisma.consentRecord.create.mockResolvedValue({})
      mockPrisma.account.update.mockResolvedValue({})

      await consentSvc.recordConsent({
        account_id: "acc_new",
        policy_versions: CURRENT_POLICY_VERSIONS,
      })

      // Step 3: needs_consent=false → guard passes
      mockPrisma.account.findUnique.mockResolvedValue({ needsConsent: false })
      await expect(testGuard.canActivate(mockContext(user))).resolves.toBe(true)
    })
  })
})
