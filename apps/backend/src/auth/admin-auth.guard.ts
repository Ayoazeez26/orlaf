import { ForbiddenException, Injectable } from "@nestjs/common"
import type { AccessTokenClaims } from "@sable/contracts"
import { AccountType } from "@sable/contracts"
import { JwtAuthGuard } from "./jwt-auth.guard"

@Injectable()
export class AdminAuthGuard extends JwtAuthGuard {
  handleRequest<TUser = AccessTokenClaims>(
    err: Error | null,
    user: TUser | false,
    info?: { message?: string }
  ): TUser {
    const claims = super.handleRequest(err, user, info) as AccessTokenClaims

    if (claims.account_type !== AccountType.ADMIN) {
      throw new ForbiddenException("Admin access required.")
    }

    return claims as TUser
  }
}
