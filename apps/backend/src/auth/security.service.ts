import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto"
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import type {
  SecurityStatusResponse,
  TotpSetupResponse,
} from "@sable/contracts"
import { generateSecret, generateURI, verifySync } from "otplib"
import { PrismaService } from "../prisma/prisma.service"
import { AccountService } from "./account.service"

const MIN_PASSWORD_LENGTH = 8

@Injectable()
export class SecurityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  private assertCreator(accountType: string) {
    if (accountType !== "creator") {
      throw new ForbiddenException("Creators only")
    }
  }

  async getSecurityStatus(
    accountId: string,
    accountType: string
  ): Promise<SecurityStatusResponse> {
    this.assertCreator(accountType)

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { passwordHash: true, totpEnabledAt: true },
    })

    if (!account) {
      throw new UnauthorizedException("Account not found")
    }

    return {
      has_password: Boolean(account.passwordHash),
      can_set_password: !account.passwordHash,
      totp_enabled: Boolean(account.totpEnabledAt),
      sms_available: false,
    }
  }

  async setPassword(
    accountId: string,
    accountType: string,
    password: string
  ): Promise<void> {
    this.assertCreator(accountType)

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new BadRequestException(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      )
    }

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { passwordHash: true },
    })

    if (!account) {
      throw new UnauthorizedException("Account not found")
    }

    if (account.passwordHash) {
      throw new ConflictException(
        "Password is already set. Use change password."
      )
    }

    const passwordHash = await this.accountService.hashPassword(password)
    await this.prisma.account.update({
      where: { id: accountId },
      data: { passwordHash },
    })
  }

  async changePassword(
    accountId: string,
    accountType: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    this.assertCreator(accountType)

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      throw new BadRequestException(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      )
    }

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { passwordHash: true },
    })

    if (!account) {
      throw new UnauthorizedException("Account not found")
    }

    if (!account.passwordHash) {
      throw new BadRequestException(
        "No password is set. Use set password instead."
      )
    }

    const currentValid = await this.accountService.verifyPassword(
      currentPassword,
      account.passwordHash
    )

    if (!currentValid) {
      throw new UnauthorizedException("Current password is incorrect.")
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException(
        "New password must be different from your current password."
      )
    }

    const passwordHash = await this.accountService.hashPassword(newPassword)
    await this.prisma.account.update({
      where: { id: accountId },
      data: { passwordHash },
    })
  }

  async setupTotp(
    accountId: string,
    accountType: string
  ): Promise<TotpSetupResponse> {
    this.assertCreator(accountType)

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { email: true, totpEnabledAt: true },
    })

    if (!account) {
      throw new UnauthorizedException("Account not found")
    }

    if (account.totpEnabledAt) {
      throw new ConflictException("Authenticator is already enabled")
    }

    const secret = generateSecret()
    const otpauthUrl = generateURI({
      issuer: "Sable Creators",
      label: account.email,
      secret,
    })

    await this.prisma.account.update({
      where: { id: accountId },
      data: { totpSecretEnc: this.encryptSecret(secret) },
    })

    return { otpauthUrl, secret }
  }

  async enableTotp(
    accountId: string,
    accountType: string,
    code: string
  ): Promise<void> {
    this.assertCreator(accountType)

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { totpSecretEnc: true, totpEnabledAt: true },
    })

    if (!account?.totpSecretEnc) {
      throw new BadRequestException("Start authenticator setup first")
    }

    if (account.totpEnabledAt) {
      throw new ConflictException("Authenticator is already enabled")
    }

    const secret = this.decryptSecret(account.totpSecretEnc)
    if (!verifySync({ token: code, secret }).valid) {
      throw new BadRequestException("Invalid verification code")
    }

    await this.prisma.account.update({
      where: { id: accountId },
      data: { totpEnabledAt: new Date() },
    })
  }

  async disableTotp(
    accountId: string,
    accountType: string,
    code: string
  ): Promise<void> {
    this.assertCreator(accountType)

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { totpSecretEnc: true, totpEnabledAt: true },
    })

    if (!account?.totpEnabledAt || !account.totpSecretEnc) {
      throw new BadRequestException("Authenticator is not enabled")
    }

    const secret = this.decryptSecret(account.totpSecretEnc)
    if (!verifySync({ token: code, secret }).valid) {
      throw new BadRequestException("Invalid verification code")
    }

    await this.prisma.account.update({
      where: { id: accountId },
      data: { totpSecretEnc: null, totpEnabledAt: null },
    })
  }

  async verifyMfaCode(mfaToken: string, code: string): Promise<string> {
    let payload: { sub?: string; purpose?: string }
    try {
      payload = this.jwtService.verify(mfaToken)
    } catch {
      throw new UnauthorizedException(
        "MFA session expired. Please sign in again."
      )
    }

    if (payload.purpose !== "mfa" || !payload.sub) {
      throw new UnauthorizedException("Invalid MFA token")
    }

    const account = await this.prisma.account.findUnique({
      where: { id: payload.sub },
      select: { totpSecretEnc: true, totpEnabledAt: true, accountType: true },
    })

    if (
      account?.accountType !== "creator" ||
      !account.totpEnabledAt ||
      !account.totpSecretEnc
    ) {
      throw new UnauthorizedException(
        "Two-factor authentication is not enabled"
      )
    }

    const secret = this.decryptSecret(account.totpSecretEnc)
    if (!verifySync({ token: code, secret }).valid) {
      throw new BadRequestException("Invalid verification code")
    }

    return payload.sub
  }

  issueMfaToken(accountId: string): string {
    return this.jwtService.sign(
      { sub: accountId, purpose: "mfa" },
      { expiresIn: "5m" }
    )
  }

  requiresMfa(account: { accountType: string; totpEnabledAt: Date | null }) {
    return account.accountType === "creator" && Boolean(account.totpEnabledAt)
  }

  private encryptionKey() {
    const raw = this.config.get<string>("TOTP_ENCRYPTION_KEY")
    if (raw) {
      return createHash("sha256").update(raw).digest()
    }
    return createHash("sha256").update("orlaf-dev-totp-key").digest()
  }

  private encryptSecret(secret: string) {
    const iv = randomBytes(12)
    const cipher = createCipheriv("aes-256-gcm", this.encryptionKey(), iv)
    const encrypted = Buffer.concat([
      cipher.update(secret, "utf8"),
      cipher.final(),
    ])
    const tag = cipher.getAuthTag()
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`
  }

  private decryptSecret(payload: string) {
    const [ivHex, tagHex, dataHex] = payload.split(":")
    if (!ivHex || !tagHex || !dataHex) {
      throw new BadRequestException("Invalid authenticator configuration")
    }
    const decipher = createDecipheriv(
      "aes-256-gcm",
      this.encryptionKey(),
      Buffer.from(ivHex, "hex")
    )
    decipher.setAuthTag(Buffer.from(tagHex, "hex"))
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataHex, "hex")),
      decipher.final(),
    ])
    return decrypted.toString("utf8")
  }
}
