import {
  AccountType,
  AdminRole,
  adminRoleToWorkspaceId,
  isAdminWorkspaceRoleId,
  workspaceIdToAdminRole,
} from "@sable/contracts"
import type { AccountService } from "./account.service"
import { seedSuperAdmin } from "./seed-superadmin"

describe("admin role mapping", () => {
  it("maps admin roles to workspace ids and back", () => {
    expect(adminRoleToWorkspaceId(AdminRole.SUPER_ADMIN)).toBe("super-admin")
    expect(adminRoleToWorkspaceId(AdminRole.CONTENT_ADMIN)).toBe(
      "content-admin"
    )
    expect(workspaceIdToAdminRole("finance-admin")).toBe(
      AdminRole.FINANCE_ADMIN
    )
    expect(isAdminWorkspaceRoleId("marketing-admin")).toBe(true)
    expect(isAdminWorkspaceRoleId("clan-admin")).toBe(false)
  })
})

describe("seedSuperAdmin()", () => {
  const mockAccountService = {
    findByEmail: jest.fn(),
    createAdmin: jest.fn(),
  } as unknown as AccountService

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("is a no-op when the super admin already exists", async () => {
    mockAccountService.findByEmail = jest.fn().mockResolvedValue({
      id: "acc_existing",
      email: "admin@sable.tv",
    })

    const result = await seedSuperAdmin(mockAccountService, {
      email: "admin@sable.tv",
    })

    expect(result).toEqual({
      created: false,
      accountId: "acc_existing",
      email: "admin@sable.tv",
    })
    expect(mockAccountService.createAdmin).not.toHaveBeenCalled()
  })

  it("creates a super admin with the provided password", async () => {
    mockAccountService.findByEmail = jest.fn().mockResolvedValue(null)
    mockAccountService.createAdmin = jest.fn().mockResolvedValue({
      id: "acc_new",
      email: "admin@sable.tv",
    })

    const result = await seedSuperAdmin(mockAccountService, {
      email: "admin@sable.tv",
      password: "TempPass123!",
    })

    expect(mockAccountService.findByEmail).toHaveBeenCalledWith(
      AccountType.ADMIN,
      "admin@sable.tv"
    )
    expect(mockAccountService.createAdmin).toHaveBeenCalledWith({
      email: "admin@sable.tv",
      role: AdminRole.SUPER_ADMIN,
      password: "TempPass123!",
    })
    expect(result.created).toBe(true)
    expect(result.generatedPassword).toBeUndefined()
  })

  it("creates a super admin and returns a generated password when omitted", async () => {
    mockAccountService.findByEmail = jest.fn().mockResolvedValue(null)
    mockAccountService.createAdmin = jest.fn().mockResolvedValue({
      id: "acc_new",
      email: "admin@sable.tv",
    })

    const result = await seedSuperAdmin(mockAccountService, {
      email: "admin@sable.tv",
    })

    expect(result.created).toBe(true)
    expect(result.generatedPassword).toMatch(/^[a-f0-9]{32}$/)
    expect(mockAccountService.createAdmin).toHaveBeenCalledWith(
      expect.objectContaining({
        role: AdminRole.SUPER_ADMIN,
        password: result.generatedPassword,
      })
    )
  })
})
