import { createHash, randomBytes } from "node:crypto"
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "../prisma/prisma.service"

// TODO(KAN-53): import Sentry once OTEL is wired
// import * as Sentry from '@sentry/node';

export interface IssueRefreshTokenInput {
  account_id: string
  device_label?: string
  /** Lifetime in seconds. Defaults to JWT_REFRESH_EXPIRES_IN env var. */
  ttl_seconds?: number
}

export interface RotateRefreshTokenResult {
  access_token: string
  refresh_token: string
  /** True when the refresh token arrived via cookie (web client) */
  is_web: boolean
}

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private generateOpaqueToken(): string {
    // 32 bytes = 256 bits of entropy, hex-encoded
    return randomBytes(32).toString("hex")
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex")
  }

  private defaultTtlSeconds(): number {
    const raw = this.config.get<string>("JWT_REFRESH_EXPIRES_IN", "2592000") // 30 days
    return parseInt(raw, 10)
  }

  // ---------------------------------------------------------------------------
  // Issue (first token in a chain — no parent)
  // ---------------------------------------------------------------------------

  async issueRefreshToken(input: IssueRefreshTokenInput): Promise<string> {
    const { account_id, device_label, ttl_seconds } = input
    const ttl = ttl_seconds ?? this.defaultTtlSeconds()
    const token = this.generateOpaqueToken()
    const tokenHash = this.hashToken(token)
    const expiresAt = new Date(Date.now() + ttl * 1000)

    try {
      await this.prisma.refreshToken.create({
        data: {
          accountId: account_id,
          tokenHash,
          expiresAt,
          deviceLabel: device_label ?? null,
        },
      })

      this.logger.log({
        event: "refresh_token_issued",
        account_id,
        expires_at: expiresAt.toISOString(),
      })

      return token
    } catch (err) {
      this.logger.error({
        event: "refresh_token_issue_failed",
        account_id,
        error: (err as Error).message,
      })
      // TODO(KAN-53): Sentry.captureException(err);
      throw err
    }
  }

  // ---------------------------------------------------------------------------
  // Rotate — core of KAN-3
  // ---------------------------------------------------------------------------

  /**
   * Validates the incoming refresh token, revokes it, and issues a fresh pair.
   *
   * Reuse detection: if the presented token is already revoked, the entire
   * chain is revoked and a 401 is returned — indicating possible token theft.
   *
   * @returns new opaque refresh token string (caller decides delivery method)
   */
  async rotateRefreshToken(
    incomingToken: string
  ): Promise<{ newRefreshToken: string; accountId: string }> {
    const tokenHash = this.hashToken(incomingToken)

    const existing = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    })

    // Unknown token
    if (!existing) {
      this.logger.warn({ event: "refresh_token_unknown", tokenHash })
      // TODO(KAN-53): Sentry.captureMessage('Unknown refresh token presented', 'warning');
      throw new UnauthorizedException("Invalid refresh token")
    }

    // Already revoked → reuse detected → revoke entire chain
    if (existing.revokedAt !== null) {
      this.logger.warn({
        event: "refresh_token_reuse_detected",
        account_id: existing.accountId,
        token_id: existing.id,
      })
      // TODO(KAN-53): Sentry.captureMessage('Refresh token reuse detected — revoking chain', 'error');
      await this.revokeChain(existing.id)
      throw new UnauthorizedException("Refresh token reuse detected")
    }

    // Expired
    if (existing.expiresAt < new Date()) {
      this.logger.warn({
        event: "refresh_token_expired",
        account_id: existing.accountId,
        token_id: existing.id,
      })
      await this.revokeSingle(existing.id)
      throw new UnauthorizedException("Refresh token expired")
    }

    // Happy path — revoke old, issue new
    const newToken = this.generateOpaqueToken()
    const newTokenHash = this.hashToken(newToken)
    const ttl = this.defaultTtlSeconds()
    const expiresAt = new Date(Date.now() + ttl * 1000)

    await this.prisma.$transaction([
      // Revoke the old token
      this.prisma.refreshToken.update({
        where: { id: existing.id },
        data: { revokedAt: new Date(), lastUsedAt: new Date() },
      }),
      // Issue new token as child of the old one
      this.prisma.refreshToken.create({
        data: {
          accountId: existing.accountId,
          tokenHash: newTokenHash,
          parentId: existing.id,
          expiresAt,
          deviceLabel: existing.deviceLabel,
        },
      }),
    ])

    this.logger.log({
      event: "refresh_token_rotated",
      account_id: existing.accountId,
      old_token_id: existing.id,
    })

    return { newRefreshToken: newToken, accountId: existing.accountId }
  }

  // ---------------------------------------------------------------------------
  // Explicit revoke (logout endpoint)
  // ---------------------------------------------------------------------------

  async revokeByToken(token: string): Promise<void> {
    const tokenHash = this.hashToken(token)
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    })

    if (!record) {
      // Treat as a no-op — already gone or never existed
      this.logger.warn({ event: "refresh_token_revoke_not_found", tokenHash })
      return
    }

    await this.revokeSingle(record.id)

    this.logger.log({
      event: "refresh_token_revoked",
      account_id: record.accountId,
      token_id: record.id,
    })
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  private async revokeSingle(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    })
  }

  /**
   * Revokes all tokens in the chain rooted at rootId (including descendants).
   * Used on reuse detection to invalidate every token derived from the stolen one.
   */
  private async revokeChain(rootId: string): Promise<void> {
    // Walk the chain iteratively to avoid deep recursion on long chains
    const toRevoke: string[] = [rootId]
    const visited = new Set<string>()

    while (toRevoke.length > 0) {
      // biome-ignore lint/style/noNonNullAssertion: fix types
      const currentId = toRevoke.pop()!
      if (visited.has(currentId)) continue
      visited.add(currentId)

      await this.prisma.refreshToken.updateMany({
        where: { id: currentId, revokedAt: null },
        data: { revokedAt: new Date() },
      })

      const children = await this.prisma.refreshToken.findMany({
        where: { parentId: currentId },
        select: { id: true },
      })

      toRevoke.push(...children.map((c) => c.id))
    }

    this.logger.warn({
      event: "refresh_token_chain_revoked",
      root_id: rootId,
      revoked_count: visited.size,
    })
  }
  /**
   * Revokes every active refresh token for an account.
   * Used by logout_all — terminates all sessions across all devices.
   */
  async revokeAllForAccount(accountId: string): Promise<number> {
    const result = await this.prisma.refreshToken.updateMany({
      where: { accountId, revokedAt: null },
      data: { revokedAt: new Date() },
    })

    this.logger.log({
      event: "refresh_tokens_all_revoked",
      account_id: accountId,
      revoked_count: result.count,
    })

    return result.count
  }
}
