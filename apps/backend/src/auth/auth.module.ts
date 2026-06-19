import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { ScheduleModule } from "@nestjs/schedule"
import { AccountService } from "./account.service"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { ConsentGuard } from "./consent.guard"
import { ConsentService } from "./consent.service"
import { DeletionService } from "./deletion.service"
import { JwksCacheService } from "./jwks-cache.service"
import { JwtStrategy } from "./jwt.strategy"
import { JwtAuthGuard } from "./jwt-auth.guard"
import { ProviderTokenService } from "./provider-token.service"
import { RefreshTokenService } from "./refresh-token.service"
import { SignInService } from "./sign-in.service"

/**
 * AuthModule — JWT plumbing + refresh token rotation + provider token verification.
 *
 * Provides:
 *   - AuthService.issueAccessToken()     — used by sign-in flows (later stories)
 *   - RefreshTokenService                — issue, rotate, reuse detection, revoke
 *   - ProviderTokenService               — verify Google and Apple ID tokens
 *   - JwksCacheService                   — JWKS key fetching with Cache-Control caching
 *   - JwtAuthGuard                       — apply to any route needing auth
 *   - JwtStrategy                        — validates Bearer tokens, populates req.user
 *
 * Endpoints:
 *   POST /auth/refresh                   — rotate refresh token, issue new pair
 *   POST /auth/refresh/revoke            — logout / revoke refresh token
 *
 * Env vars required (see auth README):
 *   JWT_PRIVATE_KEY_BASE64      PKCS8 RS256 private key, base64-encoded
 *   JWT_PUBLIC_KEY_BASE64       SPKI RS256 public key, base64-encoded
 *   JWT_ISSUER                  token issuer claim, e.g. https://api.sable.app
 *   JWT_ACCESS_EXPIRES_IN       access token lifetime in seconds — must be 900 (15 min)
 *   JWT_REFRESH_EXPIRES_IN      refresh token lifetime in seconds — default 2592000 (30 days)
 *   GOOGLE_CLIENT_ID_MOBILE     Google OAuth client ID for mobile surface
 *   GOOGLE_CLIENT_ID_WEB        Google OAuth client ID for creator web surface
 *   APPLE_SERVICE_ID_MOBILE     Apple service ID for mobile surface
 *   APPLE_SERVICE_ID_WEB        Apple service ID for creator web surface
 */
@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const privateKey = Buffer.from(
          config.getOrThrow<string>("JWT_PRIVATE_KEY_BASE64"),
          "base64"
        ).toString("utf-8")

        return {
          privateKey,
          signOptions: {
            algorithm: "RS256",
            expiresIn: parseInt(
              config.getOrThrow<string>("JWT_ACCESS_EXPIRES_IN"),
              10
            ),
            issuer: config.getOrThrow<string>("JWT_ISSUER"),
          },
        }
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RefreshTokenService,
    AccountService,
    ProviderTokenService,
    JwksCacheService,
    DeletionService,
    SignInService,
    ConsentService,
    ConsentGuard,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    RefreshTokenService,
    AccountService,
    ProviderTokenService,
    DeletionService,
    SignInService,
    ConsentService,
    ConsentGuard,
    PassportModule,
  ],
})
export class AuthModule {}
