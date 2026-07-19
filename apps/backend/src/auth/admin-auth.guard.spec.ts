import { ForbiddenException, UnauthorizedException } from "@nestjs/common"
import { AccountType, AdminRole } from "@sable/contracts"
import { AdminAuthGuard } from "./admin-auth.guard"

describe("AdminAuthGuard", () => {
  const guard = new AdminAuthGuard()

  it("rejects unauthenticated requests", () => {
    expect(() =>
      guard.handleRequest(null, false, { message: "Unauthorized" })
    ).toThrow(UnauthorizedException)
  })

  it("rejects non-admin tokens", () => {
    expect(() =>
      guard.handleRequest(null, {
        sub: "acc_1",
        account_type: AccountType.CREATOR,
        role: null,
        iat: 0,
        exp: 0,
        iss: "test",
      })
    ).toThrow(ForbiddenException)
  })

  it("returns admin claims", () => {
    const user = guard.handleRequest(null, {
      sub: "acc_admin",
      account_type: AccountType.ADMIN,
      role: AdminRole.SUPER_ADMIN,
      iat: 0,
      exp: 0,
      iss: "test",
    })

    expect(user.role).toBe(AdminRole.SUPER_ADMIN)
  })
})
