import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import type { AccessTokenClaims } from "@sable/contracts"
import { Observable } from "rxjs"

// TODO(KAN-53): propagate W3C tracecontext from incoming request headers here
// once OTEL middleware is in place. The guard sits in the hot path for every
// protected request so this is the right intercept point.

/**
 * Apply to any controller or route that requires a valid access token.
 *
 * @example
 * \@UseGuards(JwtAuthGuard)
 * \@Get('me')
 * getMe(\@Req() req: Request) { return req.user; }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name)

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // TODO(KAN-53): extract and validate tracecontext headers here
    // const req = context.switchToHttp().getRequest();
    // const traceparent = req.headers['traceparent'];

    return super.canActivate(context)
  }

  handleRequest<TUser = AccessTokenClaims>(
    err: Error | null,
    user: TUser | false,
    info?: { message?: string }
  ): TUser {
    if (err || !user) {
      this.logger.warn({
        event: "jwt_auth_rejected",
        reason: info?.message ?? err?.message ?? "unknown",
      })

      // TODO(KAN-53): Sentry.captureException(err ?? new Error(info?.message));
      throw err || new UnauthorizedException(info?.message ?? "Unauthorized")
    }

    return user
  }
}
