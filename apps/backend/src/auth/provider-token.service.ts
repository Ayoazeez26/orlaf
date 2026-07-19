import { createPublicKey, verify as cryptoVerify } from "node:crypto"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import {
  OAuthProvider,
  ProviderTokenClaims,
  ProviderTokenError,
  ProviderTokenErrorCode,
  type VerifyProviderIdTokenInput,
} from "@sable/contracts"
import { CustomLogger } from "@sable/logger"
import { JwksCacheService } from "./jwks-cache.service"

// TODO(KAN-53): Sentry.captureException on verification failures

const GOOGLE_JWKS_URI = "https://www.googleapis.com/oauth2/v3/certs"
const APPLE_JWKS_URI = "https://appleid.apple.com/auth/keys"

const GOOGLE_VALID_ISSUERS = [
  "https://accounts.google.com",
  "accounts.google.com",
]
const APPLE_VALID_ISSUER = "https://appleid.apple.com"

@Injectable()
export class ProviderTokenService {
  private readonly logger = new CustomLogger(ProviderTokenService.name)

  constructor(
    private readonly config: ConfigService,
    private readonly jwksCache: JwksCacheService
  ) {}

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  async verifyProviderIdToken(
    input: VerifyProviderIdTokenInput
  ): Promise<ProviderTokenClaims> {
    const { provider, id_token, surface } = input

    this.logger.log({ event: "provider_token_verify_start", provider, surface })

    try {
      const claims =
        provider === OAuthProvider.GOOGLE
          ? await this.verifyGoogle(id_token, surface)
          : await this.verifyApple(id_token, surface)

      this.logger.log({
        event: "provider_token_verified",
        provider,
        surface,
        sub: claims.sub,
      })

      return claims
    } catch (err) {
      if (err instanceof ProviderTokenError) throw err

      this.logger.error({
        event: "provider_token_verify_failed",
        provider,
        surface,
        error: (err as Error).message,
      })
      // TODO(KAN-53): Sentry.captureException(err);
      throw new ProviderTokenError(
        (err as Error).message,
        ProviderTokenErrorCode.INVALID_TOKEN
      )
    }
  }

  // ---------------------------------------------------------------------------
  // Google
  // ---------------------------------------------------------------------------

  private async verifyGoogle(
    idToken: string,
    surface: "mobile" | "web"
  ): Promise<ProviderTokenClaims> {
    const expectedAudiences =
      surface === "mobile"
        ? [
            this.config.getOrThrow<string>("GOOGLE_CLIENT_ID_MOBILE"),
            this.config.getOrThrow<string>("GOOGLE_CLIENT_ID_WEB"),
          ]
        : [this.config.getOrThrow<string>("GOOGLE_CLIENT_ID_WEB")]

    const { header, payload } = this.decodeToken(idToken)

    // Issuer check
    if (!GOOGLE_VALID_ISSUERS.includes(payload.iss)) {
      throw new ProviderTokenError(
        `Invalid Google issuer: ${payload.iss}`,
        ProviderTokenErrorCode.WRONG_ISSUER
      )
    }

    // Audience check — mobile SDK id tokens use the web client ID audience
    const tokenAudiences = Array.isArray(payload.aud)
      ? payload.aud
      : [payload.aud]
    if (!tokenAudiences.some((aud) => expectedAudiences.includes(aud))) {
      throw new ProviderTokenError(
        `Google token audience mismatch`,
        ProviderTokenErrorCode.WRONG_AUDIENCE
      )
    }

    // Expiry check
    this.assertNotExpired(payload.exp)

    // Signature check
    await this.verifySignature(idToken, header.kid, GOOGLE_JWKS_URI)

    return {
      sub: payload.sub,
      email: payload.email,
      email_verified: payload.email_verified === true,
      name: payload.name,
    }
  }

  // ---------------------------------------------------------------------------
  // Apple
  // ---------------------------------------------------------------------------

  private async verifyApple(
    idToken: string,
    surface: "mobile" | "web"
  ): Promise<ProviderTokenClaims> {
    const audience =
      surface === "mobile"
        ? this.config.getOrThrow<string>("APPLE_SERVICE_ID_MOBILE")
        : this.config.getOrThrow<string>("APPLE_SERVICE_ID_WEB")

    const { header, payload } = this.decodeToken(idToken)

    // Issuer check
    if (payload.iss !== APPLE_VALID_ISSUER) {
      throw new ProviderTokenError(
        `Invalid Apple issuer: ${payload.iss}`,
        ProviderTokenErrorCode.WRONG_ISSUER
      )
    }

    // Audience check
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
    if (!audiences.includes(audience)) {
      throw new ProviderTokenError(
        `Apple token audience mismatch`,
        ProviderTokenErrorCode.WRONG_AUDIENCE
      )
    }

    // Expiry check
    this.assertNotExpired(payload.exp)

    // Signature check
    await this.verifySignature(idToken, header.kid, APPLE_JWKS_URI)

    // Apple private relay emails are accepted as-is
    const email: string = payload.email ?? ""

    return {
      sub: payload.sub,
      email,
      email_verified:
        payload.email_verified === true || payload.email_verified === "true",
      // Apple only returns name on first sign-in — may be absent
      name: payload.name,
      is_private_email:
        payload.is_private_email === true ||
        payload.is_private_email === "true",
    }
  }

  // ---------------------------------------------------------------------------
  // Signature verification
  // ---------------------------------------------------------------------------

  private async verifySignature(
    idToken: string,
    kid: string,
    jwksUri: string
  ): Promise<void> {
    let keys = await this.jwksCache.getKeys(jwksUri)
    let key = keys.find((k) => k.kid === kid)

    // kid not found — provider may have rotated keys, try once after cache bust
    if (!key) {
      this.logger.log({ event: "jwks_kid_not_found_refreshing", kid })
      this.jwksCache.invalidate(jwksUri)
      keys = await this.jwksCache.getKeys(jwksUri)
      key = keys.find((k) => k.kid === kid)
    }

    if (!key) {
      throw new ProviderTokenError(
        `No JWKS key found for kid: ${kid}`,
        ProviderTokenErrorCode.BAD_SIGNATURE
      )
    }

    const [headerB64, payloadB64, signatureB64] = idToken.split(".")
    const signingInput = `${headerB64}.${payloadB64}`
    const signature = Buffer.from(
      signatureB64.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    )

    const publicKey = createPublicKey({ key: key as any, format: "jwk" })

    const algorithm = key.alg === "ES256" ? "SHA256" : "SHA256" // RS256 and ES256 both use SHA256
    const isValid = cryptoVerify(
      algorithm,
      Buffer.from(signingInput),
      publicKey,
      signature
    )

    if (!isValid) {
      throw new ProviderTokenError(
        "Token signature verification failed",
        ProviderTokenErrorCode.BAD_SIGNATURE
      )
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private decodeToken(token: string): {
    header: any
    payload: any
  } {
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new ProviderTokenError(
        "Malformed JWT — expected 3 parts",
        ProviderTokenErrorCode.INVALID_TOKEN
      )
    }

    try {
      const header = JSON.parse(
        Buffer.from(
          parts[0].replace(/-/g, "+").replace(/_/g, "/"),
          "base64"
        ).toString()
      )
      const payload = JSON.parse(
        Buffer.from(
          parts[1].replace(/-/g, "+").replace(/_/g, "/"),
          "base64"
        ).toString()
      )
      return { header, payload }
    } catch {
      throw new ProviderTokenError(
        "Failed to decode JWT parts",
        ProviderTokenErrorCode.INVALID_TOKEN
      )
    }
  }

  private assertNotExpired(exp: number): void {
    if (!exp || Date.now() / 1000 > exp) {
      throw new ProviderTokenError(
        "Provider token has expired",
        ProviderTokenErrorCode.EXPIRED
      )
    }
  }
}
