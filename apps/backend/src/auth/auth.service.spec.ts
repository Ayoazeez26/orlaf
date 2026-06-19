import { generateKeyPairSync } from "node:crypto"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule, JwtService } from "@nestjs/jwt"
import { Test, TestingModule } from "@nestjs/testing"
import { AccountType, AdminRole } from "@sable/contracts"
import { AuthService } from "./auth.service"

/**
 * Generate a fresh RS256 key pair for each test run.
 * Never use a hardcoded key in tests — it would be a secret leak risk.
 */
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
})

const TEST_ISSUER = "https://api.sable.test"
const TEST_EXPIRES_IN = 900 // 15 minutes

function buildModule(overrideEnv?: Record<string, string>) {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        ignoreEnvFile: true,
        load: [
          () => ({
            JWT_PRIVATE_KEY_BASE64: Buffer.from(privateKey).toString("base64"),
            JWT_PUBLIC_KEY_BASE64: Buffer.from(publicKey).toString("base64"),
            JWT_ISSUER: TEST_ISSUER,
            JWT_ACCESS_EXPIRES_IN: String(TEST_EXPIRES_IN),
            ...overrideEnv,
          }),
        ],
      }),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          privateKey: Buffer.from(
            config.getOrThrow<string>("JWT_PRIVATE_KEY_BASE64"),
            "base64"
          ).toString("utf-8"),
          signOptions: {
            algorithm: "RS256",
            expiresIn: parseInt(
              config.getOrThrow<string>("JWT_ACCESS_EXPIRES_IN"),
              10
            ),
            issuer: config.getOrThrow<string>("JWT_ISSUER"),
          },
        }),
      }),
    ],
    providers: [AuthService],
  }).compile()
}

describe("AuthService", () => {
  let module: TestingModule
  let authService: AuthService
  let jwtService: JwtService

  beforeEach(async () => {
    module = await buildModule()
    authService = module.get(AuthService)
    jwtService = module.get(JwtService)
  })

  afterEach(async () => {
    await module.close()
  })

  describe("issueAccessToken()", () => {
    it("returns a non-empty JWT string", () => {
      const token = authService.issueAccessToken({
        account_id: "acc_123",
        account_type: AccountType.USER,
        role: null,
      })

      expect(typeof token).toBe("string")
      expect(token.split(".").length).toBe(3) // header.payload.signature
    })

    it("encodes the correct claims in the payload", () => {
      const token = authService.issueAccessToken({
        account_id: "acc_abc",
        account_type: AccountType.CREATOR,
        role: null,
      })

      const decoded = jwtService.decode(token) as Record<string, unknown>

      expect(decoded.sub).toBe("acc_abc")
      expect(decoded.account_type).toBe(AccountType.CREATOR)
      expect(decoded.role).toBeNull()
      expect(decoded.iss).toBe(TEST_ISSUER)
    })

    it("sets role for admin accounts", () => {
      const token = authService.issueAccessToken({
        account_id: "admin_001",
        account_type: AccountType.ADMIN,
        role: AdminRole.CLAN_ADMIN,
      })

      const decoded = jwtService.decode(token) as Record<string, unknown>

      expect(decoded.role).toBe(AdminRole.CLAN_ADMIN)
      expect(decoded.account_type).toBe(AccountType.ADMIN)
    })

    it("sets exp to approximately 15 minutes from now", () => {
      const before = Math.floor(Date.now() / 1000)

      const token = authService.issueAccessToken({
        account_id: "acc_exp",
        account_type: AccountType.USER,
        role: null,
      })

      const after = Math.floor(Date.now() / 1000)
      const decoded = jwtService.decode(token) as Record<string, number>

      // exp should be iat + 900 (± 2s for test execution time)
      expect(decoded.exp - decoded.iat).toBe(TEST_EXPIRES_IN)
      expect(decoded.iat).toBeGreaterThanOrEqual(before)
      expect(decoded.iat).toBeLessThanOrEqual(after)
    })

    it("uses RS256 algorithm", () => {
      const token = authService.issueAccessToken({
        account_id: "acc_alg",
        account_type: AccountType.USER,
        role: null,
      })

      const header = JSON.parse(
        Buffer.from(token.split(".")[0], "base64url").toString()
      )

      expect(header.alg).toBe("RS256")
    })
  })

  describe("token verification", () => {
    it("verifies a valid token with the public key", async () => {
      const token = authService.issueAccessToken({
        account_id: "acc_verify",
        account_type: AccountType.USER,
        role: null,
      })

      const verified = await jwtService.verifyAsync(token, {
        publicKey,
        algorithms: ["RS256"],
        issuer: TEST_ISSUER,
      })

      expect(verified.sub).toBe("acc_verify")
    })

    it("rejects a tampered token", async () => {
      const token = authService.issueAccessToken({
        account_id: "acc_tamper",
        account_type: AccountType.USER,
        role: null,
      })

      // Flip one character in the signature segment
      const parts = token.split(".")
      parts[2] = parts[2].slice(0, -1) + (parts[2].endsWith("A") ? "B" : "A")
      const tamperedToken = parts.join(".")

      await expect(
        jwtService.verifyAsync(tamperedToken, {
          publicKey,
          algorithms: ["RS256"],
          issuer: TEST_ISSUER,
        })
      ).rejects.toThrow()
    })

    it("rejects an expired token", async () => {
      // Issue with -1s expiry — already expired at the moment of signing
      const expiredToken = jwtService.sign(
        {
          sub: "acc_expired",
          account_type: AccountType.USER,
          role: null,
          iss: TEST_ISSUER,
        },
        { expiresIn: -1 }
      )

      await expect(
        jwtService.verifyAsync(expiredToken, {
          publicKey,
          algorithms: ["RS256"],
          issuer: TEST_ISSUER,
        })
      ).rejects.toThrow(/expired/i)
    })

    it("rejects a token signed with a different private key", async () => {
      const { privateKey: otherPrivateKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      })

      const rogueToken = jwtService.sign(
        { sub: "acc_rogue", account_type: AccountType.USER, role: null },
        { algorithm: "RS256", privateKey: otherPrivateKey }
      )

      await expect(
        jwtService.verifyAsync(rogueToken, {
          publicKey, // our public key — should not match the rogue token
          algorithms: ["RS256"],
          issuer: TEST_ISSUER,
        })
      ).rejects.toThrow()
    })
  })
})
