import { ExecutionContext, ForbiddenException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AccountType, AdminRole } from "@sable/contracts"
import { ROLES_KEY } from "./roles.decorator"
import { RolesGuard } from "./roles.guard"

function mockContext(user?: {
  sub: string
  account_type: AccountType
  role: AdminRole | null
}): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as ExecutionContext
}

describe("RolesGuard", () => {
  let guard: RolesGuard
  let reflector: Reflector

  beforeEach(() => {
    reflector = new Reflector()
    guard = new RolesGuard(reflector)
  })

  it("allows when no roles are required", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined)

    expect(
      guard.canActivate(
        mockContext({
          sub: "acc_1",
          account_type: AccountType.ADMIN,
          role: AdminRole.CONTENT_ADMIN,
        })
      )
    ).toBe(true)
  })

  it("allows super admin regardless of required roles", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([AdminRole.FINANCE_ADMIN])

    expect(
      guard.canActivate(
        mockContext({
          sub: "acc_1",
          account_type: AccountType.ADMIN,
          role: AdminRole.SUPER_ADMIN,
        })
      )
    ).toBe(true)
  })

  it("allows matching role", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([AdminRole.CONTENT_ADMIN])

    expect(
      guard.canActivate(
        mockContext({
          sub: "acc_1",
          account_type: AccountType.ADMIN,
          role: AdminRole.CONTENT_ADMIN,
        })
      )
    ).toBe(true)
  })

  it("rejects non-matching role", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([AdminRole.FINANCE_ADMIN])

    expect(() =>
      guard.canActivate(
        mockContext({
          sub: "acc_1",
          account_type: AccountType.ADMIN,
          role: AdminRole.CONTENT_ADMIN,
        })
      )
    ).toThrow(ForbiddenException)
  })

  it("rejects when role claim is missing", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([AdminRole.CONTENT_ADMIN])

    expect(() =>
      guard.canActivate(
        mockContext({
          sub: "acc_1",
          account_type: AccountType.ADMIN,
          role: null,
        })
      )
    ).toThrow(ForbiddenException)
  })

  it("reads roles metadata key", () => {
    const spy = jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([AdminRole.SUPPORT_ADMIN])

    guard.canActivate(
      mockContext({
        sub: "acc_1",
        account_type: AccountType.ADMIN,
        role: AdminRole.SUPPORT_ADMIN,
      })
    )

    expect(spy).toHaveBeenCalledWith(ROLES_KEY, expect.any(Array))
  })
})
