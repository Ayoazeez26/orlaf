import { createSign, generateKeyPairSync } from "node:crypto"
import { ConfigModule } from "@nestjs/config"
import { Test, TestingModule } from "@nestjs/testing"
import {
  OAuthProvider,
  ProviderTokenError,
  ProviderTokenErrorCode,
} from "@sable/contracts"
import { JwksCacheService } from "./jwks-cache.service"
import { ProviderTokenService } from "./provider-token.service"

// ---------------------------------------------------------------------------
// Key fixtures — generated once per test run
// ---------------------------------------------------------------------------

const { privateKey: rsaPrivate, publicKey: rsaPublic } = generateKeyPairSync(
  "rsa",
  {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "jwk" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  }
)

const { privateKey: ecPrivate, publicKey: ecPublic } = generateKeyPairSync(
  "ec",
  {
    namedCurve: "prime256v1",
    publicKeyEncoding: { type: "spki", format: "jwk" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  }
)

const GOOGLE_KID = "google-test-kid"
const APPLE_KID = "apple-test-kid"

const GOOGLE_MOBILE_AUDIENCE = "google-mobile-client-id"
const GOOGLE_WEB_AUDIENCE = "google-web-client-id"
const APPLE_MOBILE_AUDIENCE = "apple-mobile-service-id"
const APPLE_WEB_AUDIENCE = "apple-web-service-id"

// ---------------------------------------------------------------------------
// JWT builder
// ---------------------------------------------------------------------------

function buildJwt(
  payload: Record<string, unknown>,
  privateKeyPem: string,
  kid: string,
  alg: "RS256" | "ES256"
): string {
  const header = Buffer.from(JSON.stringify({ alg, kid, typ: "JWT" })).toString(
    "base64url"
  )
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const signingInput = `${header}.${body}`

  const sign = createSign("SHA256")
  sign.update(signingInput)
  const signature = sign.sign(privateKeyPem, "base64url")

  return `${signingInput}.${signature}`
}

function googlePayload(overrides: Record<string, unknown> = {}) {
  return {
    iss: "https://accounts.google.com",
    aud: GOOGLE_MOBILE_AUDIENCE,
    sub: "google-user-123",
    email: "user@gmail.com",
    email_verified: true,
    name: "Test User",
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    ...overrides,
  }
}

function applePayload(overrides: Record<string, unknown> = {}) {
  return {
    iss: "https://appleid.apple.com",
    aud: APPLE_MOBILE_AUDIENCE,
    sub: "apple-user-456",
    email: "user@privaterelay.appleid.com",
    email_verified: true,
    is_private_email: true,
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Mock JWKS cache
// ---------------------------------------------------------------------------

const mockJwksCache = {
  getKeys: jest.fn(),
  invalidate: jest.fn(),
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ProviderTokenService", () => {
  let service: ProviderTokenService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [
            () => ({
              GOOGLE_CLIENT_ID_MOBILE: GOOGLE_MOBILE_AUDIENCE,
              GOOGLE_CLIENT_ID_WEB: GOOGLE_WEB_AUDIENCE,
              APPLE_SERVICE_ID_MOBILE: APPLE_MOBILE_AUDIENCE,
              APPLE_SERVICE_ID_WEB: APPLE_WEB_AUDIENCE,
            }),
          ],
        }),
      ],
      providers: [
        ProviderTokenService,
        { provide: JwksCacheService, useValue: mockJwksCache },
      ],
    }).compile()

    service = module.get(ProviderTokenService)
  })

  // -------------------------------------------------------------------------
  // Google — happy path
  // -------------------------------------------------------------------------

  describe("Google — happy path", () => {
    it("returns verified claims for a valid Google token", async () => {
      mockJwksCache.getKeys.mockResolvedValue([
        { kid: GOOGLE_KID, alg: "RS256", rsaPublic },
      ])

      const token = buildJwt(
        googlePayload(),
        rsaPrivate as string,
        GOOGLE_KID,
        "RS256"
      )

      const claims = await service.verifyProviderIdToken({
        provider: OAuthProvider.GOOGLE,
        id_token: token,
        surface: "mobile",
      })

      expect(claims.sub).toBe("google-user-123")
      expect(claims.email).toBe("user@gmail.com")
      expect(claims.email_verified).toBe(true)
      expect(claims.name).toBe("Test User")
    })

    it("accepts accounts.google.com as a valid issuer", async () => {
      mockJwksCache.getKeys.mockResolvedValue([
        { kid: GOOGLE_KID, alg: "RS256", rsaPublic },
      ])

      const token = buildJwt(
        googlePayload({ iss: "accounts.google.com" }),
        rsaPrivate as string,
        GOOGLE_KID,
        "RS256"
      )

      await expect(
        service.verifyProviderIdToken({
          provider: OAuthProvider.GOOGLE,
          id_token: token,
          surface: "mobile",
        })
      ).resolves.not.toThrow()
    })
  })

  // -------------------------------------------------------------------------
  // Apple — happy path
  // -------------------------------------------------------------------------

  describe("Apple — happy path", () => {
    it("returns verified claims for a valid Apple token", async () => {
      mockJwksCache.getKeys.mockResolvedValue([
        { kid: APPLE_KID, alg: "ES256", ecPublic },
      ])

      const token = buildJwt(
        applePayload(),
        ecPrivate as string,
        APPLE_KID,
        "ES256"
      )

      const claims = await service.verifyProviderIdToken({
        provider: OAuthProvider.APPLE,
        id_token: token,
        surface: "mobile",
      })

      expect(claims.sub).toBe("apple-user-456")
      expect(claims.email).toBe("user@privaterelay.appleid.com")
      expect(claims.is_private_email).toBe(true)
      expect(claims.email_verified).toBe(true)
    })

    it("accepts Apple private relay email", async () => {
      mockJwksCache.getKeys.mockResolvedValue([
        { kid: APPLE_KID, alg: "ES256", ecPublic },
      ])

      const token = buildJwt(
        applePayload({ email: "abc123@privaterelay.appleid.com" }),
        ecPrivate as string,
        APPLE_KID,
        "ES256"
      )

      const claims = await service.verifyProviderIdToken({
        provider: OAuthProvider.APPLE,
        id_token: token,
        surface: "mobile",
      })

      expect(claims.email).toBe("abc123@privaterelay.appleid.com")
    })

    it("handles missing name claim gracefully (Apple first sign-in only)", async () => {
      mockJwksCache.getKeys.mockResolvedValue([
        { kid: APPLE_KID, alg: "ES256", ecPublic },
      ])

      const payload = applePayload()
      delete (payload as any).name

      const token = buildJwt(payload, ecPrivate as string, APPLE_KID, "ES256")

      const claims = await service.verifyProviderIdToken({
        provider: OAuthProvider.APPLE,
        id_token: token,
        surface: "mobile",
      })

      expect(claims.name).toBeUndefined()
    })
  })

  // -------------------------------------------------------------------------
  // Expired token
  // -------------------------------------------------------------------------

  describe("expired token", () => {
    it("throws EXPIRED for an expired Google token", async () => {
      mockJwksCache.getKeys.mockResolvedValue([
        { kid: GOOGLE_KID, alg: "RS256", rsaPublic },
      ])

      const token = buildJwt(
        googlePayload({ exp: Math.floor(Date.now() / 1000) - 60 }),
        rsaPrivate as string,
        GOOGLE_KID,
        "RS256"
      )

      await expect(
        service.verifyProviderIdToken({
          provider: OAuthProvider.GOOGLE,
          id_token: token,
          surface: "mobile",
        })
      ).rejects.toMatchObject({ code: ProviderTokenErrorCode.EXPIRED })
    })
  })

  // -------------------------------------------------------------------------
  // Wrong audience
  // -------------------------------------------------------------------------

  describe("wrong audience", () => {
    it("throws WRONG_AUDIENCE when audience does not match", async () => {
      mockJwksCache.getKeys.mockResolvedValue([
        { kid: GOOGLE_KID, alg: "RS256", rsaPublic },
      ])

      const token = buildJwt(
        googlePayload({ aud: "wrong-audience" }),
        rsaPrivate as string,
        GOOGLE_KID,
        "RS256"
      )

      await expect(
        service.verifyProviderIdToken({
          provider: OAuthProvider.GOOGLE,
          id_token: token,
          surface: "mobile",
        })
      ).rejects.toMatchObject({ code: ProviderTokenErrorCode.WRONG_AUDIENCE })
    })
  })

  // -------------------------------------------------------------------------
  // Wrong issuer
  // -------------------------------------------------------------------------

  describe("wrong issuer", () => {
    it("throws WRONG_ISSUER for an invalid Google issuer", async () => {
      mockJwksCache.getKeys.mockResolvedValue([
        { kid: GOOGLE_KID, alg: "RS256", rsaPublic },
      ])

      const token = buildJwt(
        googlePayload({ iss: "https://evil.com" }),
        rsaPrivate as string,
        GOOGLE_KID,
        "RS256"
      )

      await expect(
        service.verifyProviderIdToken({
          provider: OAuthProvider.GOOGLE,
          id_token: token,
          surface: "mobile",
        })
      ).rejects.toMatchObject({ code: ProviderTokenErrorCode.WRONG_ISSUER })
    })

    it("throws WRONG_ISSUER for an invalid Apple issuer", async () => {
      mockJwksCache.getKeys.mockResolvedValue([
        { kid: APPLE_KID, alg: "ES256", ecPublic },
      ])

      const token = buildJwt(
        applePayload({ iss: "https://evil.com" }),
        ecPrivate as string,
        APPLE_KID,
        "ES256"
      )

      await expect(
        service.verifyProviderIdToken({
          provider: OAuthProvider.APPLE,
          id_token: token,
          surface: "mobile",
        })
      ).rejects.toMatchObject({ code: ProviderTokenErrorCode.WRONG_ISSUER })
    })
  })

  // -------------------------------------------------------------------------
  // Bad signature
  // -------------------------------------------------------------------------

  describe("bad signature", () => {
    it("throws BAD_SIGNATURE when token is tampered", async () => {
      mockJwksCache.getKeys.mockResolvedValue([
        { kid: GOOGLE_KID, alg: "RS256", rsaPublic },
      ])

      const token = buildJwt(
        googlePayload(),
        rsaPrivate as string,
        GOOGLE_KID,
        "RS256"
      )

      // Tamper with the payload segment
      const parts = token.split(".")
      parts[1] = Buffer.from(
        JSON.stringify({ ...googlePayload(), sub: "hacker" })
      ).toString("base64url")
      const tampered = parts.join(".")

      await expect(
        service.verifyProviderIdToken({
          provider: OAuthProvider.GOOGLE,
          id_token: tampered,
          surface: "mobile",
        })
      ).rejects.toMatchObject({ code: ProviderTokenErrorCode.BAD_SIGNATURE })
    })

    it("throws BAD_SIGNATURE when kid is not in JWKS", async () => {
      // First call returns empty, second call (after invalidate) also empty
      mockJwksCache.getKeys.mockResolvedValue([])

      const token = buildJwt(
        googlePayload(),
        rsaPrivate as string,
        "unknown-kid",
        "RS256"
      )

      await expect(
        service.verifyProviderIdToken({
          provider: OAuthProvider.GOOGLE,
          id_token: token,
          surface: "mobile",
        })
      ).rejects.toMatchObject({ code: ProviderTokenErrorCode.BAD_SIGNATURE })

      // Should have tried to refresh the cache once
      expect(mockJwksCache.invalidate).toHaveBeenCalledTimes(1)
    })
  })

  // -------------------------------------------------------------------------
  // Unreachable JWKS
  // -------------------------------------------------------------------------

  describe("unreachable JWKS", () => {
    it("throws JWKS_UNREACHABLE when the cache service throws", async () => {
      mockJwksCache.getKeys.mockRejectedValue(
        new ProviderTokenError(
          "JWKS endpoint unreachable",
          ProviderTokenErrorCode.JWKS_UNREACHABLE
        )
      )

      const token = buildJwt(
        googlePayload(),
        rsaPrivate as string,
        GOOGLE_KID,
        "RS256"
      )

      await expect(
        service.verifyProviderIdToken({
          provider: OAuthProvider.GOOGLE,
          id_token: token,
          surface: "mobile",
        })
      ).rejects.toMatchObject({ code: ProviderTokenErrorCode.JWKS_UNREACHABLE })
    })
  })
})
