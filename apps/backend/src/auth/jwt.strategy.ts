import { Injectable, Logger, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import type { AccessTokenClaims } from "@sable/contracts"
import { ExtractJwt, Strategy } from "passport-jwt"

// TODO(KAN-53): import Sentry for exception capture once OTEL is wired
// import * as Sentry from '@sentry/node';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name)

  constructor(config: ConfigService) {
    const publicKey = Buffer.from(
      config.getOrThrow<string>("JWT_PUBLIC_KEY_BASE64"),
      "base64"
    ).toString("utf-8")

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: ["RS256"],
      issuer: config.getOrThrow<string>("JWT_ISSUER"),
    })
  }

  /**
   * Called by Passport after signature + expiry are verified.
   * Return value is attached to req.user as AccessTokenClaims.
   *
   * Throwing here will cause a 401 — use it for any claim-level
   * validation beyond what Passport already checks.
   */
  validate(payload: AccessTokenClaims): AccessTokenClaims {
    if (!payload.sub || !payload.account_type) {
      this.logger.warn({
        event: "jwt_validation_failed",
        reason: "missing_required_claims",
        sub: payload.sub,
        account_type: payload.account_type,
      })

      // TODO(KAN-53): Sentry.captureMessage('JWT missing required claims', 'warning');
      throw new UnauthorizedException("Invalid token claims")
    }

    this.logger.debug({
      event: "jwt_validated",
      sub: payload.sub,
      account_type: payload.account_type,
    })

    return payload
  }
}
