import { ExecutionContext, Injectable, Logger } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
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

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (err || !user) {
      this.logger.warn({
        event: "jwt_auth_rejected",
        reason: info?.message ?? err?.message ?? "unknown",
      })

      // TODO(KAN-53): Sentry.captureException(err ?? new Error(info?.message));
      throw err || new Error(info?.message ?? "Unauthorized")
    }

    return user
  }
}
