import { randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

const scryptAsync = promisify(scrypt)

@Injectable()
export class OtpService {
  private readonly expiresInSeconds: number
  private readonly maxAttempts: number
  private readonly resendCooldownSeconds: number

  constructor(private readonly config: ConfigService) {
    this.expiresInSeconds = parseInt(
      this.config.get<string>("OTP_EXPIRES_IN_SECONDS") ?? "600",
      10
    )
    this.maxAttempts = parseInt(
      this.config.get<string>("OTP_MAX_ATTEMPTS") ?? "5",
      10
    )
    this.resendCooldownSeconds = parseInt(
      this.config.get<string>("OTP_RESEND_COOLDOWN_SECONDS") ?? "60",
      10
    )
  }

  get expiresIn(): number {
    return this.expiresInSeconds
  }

  get maxAttemptsLimit(): number {
    return this.maxAttempts
  }

  get resendCooldown(): number {
    return this.resendCooldownSeconds
  }

  generateCode(): string {
    return randomInt(0, 1_000_000).toString().padStart(6, "0")
  }

  async hashCode(code: string): Promise<string> {
    const salt = randomBytes(16).toString("hex")
    const hash = (await scryptAsync(code, salt, 64)) as Buffer
    return `${salt}:${hash.toString("hex")}`
  }

  async verifyCode(code: string, storedHash: string): Promise<boolean> {
    const [salt, stored] = storedHash.split(":")
    const hash = (await scryptAsync(code, salt, 64)) as Buffer
    const storedBuffer = Buffer.from(stored, "hex")
    return timingSafeEqual(hash, storedBuffer)
  }

  expiresAtFromNow(): Date {
    return new Date(Date.now() + this.expiresInSeconds * 1000)
  }

  isExpired(expiresAt: Date): boolean {
    return expiresAt.getTime() <= Date.now()
  }

  canResend(lastSentAt: Date): boolean {
    const elapsed = Date.now() - lastSentAt.getTime()
    return elapsed >= this.resendCooldownSeconds * 1000
  }

  resendCooldownRemainingSeconds(lastSentAt: Date): number {
    const elapsed = Date.now() - lastSentAt.getTime()
    const remaining = this.resendCooldownSeconds * 1000 - elapsed
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0
  }
}
