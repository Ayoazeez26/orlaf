import {
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import type { AccessTokenClaims } from "@sable/contracts"
import { Observable } from "rxjs"

/**
 * Like JwtAuthGuard, but allows unauthenticated requests through.
 * When a Bearer token is present and valid, populates `req.user`.
 * Missing/invalid tokens leave `req.user` undefined.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(OptionalJwtAuthGuard.name)

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string }
    }>()
    if (!request.headers.authorization) {
      return true
    }
    return super.canActivate(context)
  }

  handleRequest<TUser = AccessTokenClaims>(
    err: Error | null,
    user: TUser | false,
    info?: { message?: string }
  ): TUser | undefined {
    if (err || !user) {
      this.logger.debug({
        event: "optional_jwt_auth_skipped",
        reason: info?.message ?? err?.message ?? "no_user",
      })
      return undefined
    }
    return user
  }
}
