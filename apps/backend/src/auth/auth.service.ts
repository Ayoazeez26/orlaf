import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import type { AccessTokenClaims, IssueAccessTokenInput } from "@sable/contracts"
import { CustomLogger } from "@sable/logger"

// TODO(KAN-53): import Sentry for exception capture once OTEL is wired
// import * as Sentry from '@sentry/node';

@Injectable()
export class AuthService {
  private readonly logger = new CustomLogger(AuthService.name)

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Issues a signed RS256 access token valid for 15 minutes.
   *
   * Called by sign-in handlers (Google OAuth, Apple OAuth, admin password)
   * after identity has been verified — this method does NOT verify any
   * provider token. It only signs our own JWT.
   *
   * @returns Compact serialised JWT string
   */
  issueAccessToken(input: IssueAccessTokenInput): string {
    const { account_id, account_type, role } = input

    const payload: Omit<AccessTokenClaims, "iat" | "exp" | "iss"> = {
      sub: account_id,
      account_type,
      role,
    }

    this.logger.log({
      event: "access_token_issued",
      account_id,
      account_type,
      // W3C tracecontext: trace_id propagated via AsyncLocalStorage by the
      // OTEL middleware (KAN-53). Logger will pick it up automatically once wired.
    })

    try {
      const token = this.jwtService.sign(payload)
      return token
    } catch (err) {
      this.logger.error({
        event: "access_token_sign_failed",
        account_id,
        account_type,
        error: (err as Error).message,
      })

      // TODO(KAN-53): Sentry.captureException(err);
      throw err
    }
  }
}
