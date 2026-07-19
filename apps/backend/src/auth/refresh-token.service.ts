import { createHash, randomBytes } from "node:crypto"
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import type { ActiveSession } from "@sable/contracts"
import { CustomLogger } from "@sable/logger"
import { AdminRole as PrismaAdminRole } from "src/generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import {
  formatSessionDeviceLabel,
  type ParsedSessionMetadata,
} from "./session-metadata.util"

export interface IssueRefreshTokenInput {
  account_id: string
  device_label?: string
  /** Lifetime in seconds. Defaults to JWT_REFRESH_EXPIRES_IN env var. */
  ttl_seconds?: number
  session?: ParsedSessionMetadata
}

@Injectable()
export class RefreshTokenService {
  private readonly logger = new CustomLogger(RefreshTokenService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  private generateOpaqueToken(): string {
    return randomBytes(32).toString("hex")
  }

  hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex")
  }

  private defaultTtlSeconds(): number {
    const raw = this.config.get<string>("JWT_REFRESH_EXPIRES_IN", "2592000")
    return parseInt(raw, 10)
  }

  private sessionData(
    sessionRootId: string,
    session?: ParsedSessionMetadata,
    device_label?: string
  ) {
    return {
      sessionRootId,
      surface: session?.surface ?? null,
      browser: session?.browser ?? null,
      os: session?.os ?? null,
      userAgent: session?.userAgent ?? null,
      ipAddress: session?.ipAddress ?? null,
      location: session?.location ?? null,
      deviceLabel: session?.deviceLabel ?? device_label ?? null,
    }
  }

  async issueRefreshToken(input: IssueRefreshTokenInput): Promise<string> {
    const { account_id, device_label, ttl_seconds, session } = input
    const ttl = ttl_seconds ?? this.defaultTtlSeconds()
    const token = this.generateOpaqueToken()
    const tokenHash = this.hashToken(token)
    const expiresAt = new Date(Date.now() + ttl * 1000)
    const sessionRootId = randomBytes(16).toString("hex")

    try {
      await this.prisma.refreshToken.create({
        data: {
          accountId: account_id,
          tokenHash,
          expiresAt,
          ...this.sessionData(sessionRootId, session, device_label),
        },
      })

      this.logger.log({
        event: "refresh_token_issued",
        account_id,
        session_root_id: sessionRootId,
        expires_at: expiresAt.toISOString(),
      })

      return token
    } catch (err) {
      this.logger.error({
        event: "refresh_token_issue_failed",
        account_id,
        error: (err as Error).message,
      })
      throw err
    }
  }

  async rotateRefreshToken(incomingToken: string): Promise<{
    newRefreshToken: string
    accountId: string
    accountType: string
    adminRole: PrismaAdminRole | null
  }> {
    const tokenHash = this.hashToken(incomingToken)

    const existing = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        account: {
          select: { accountType: true, adminRole: true },
        },
      },
    })

    if (!existing) {
      this.logger.warn({ event: "refresh_token_unknown", tokenHash })
      throw new UnauthorizedException("Invalid refresh token")
    }

    if (existing.revokedAt !== null) {
      this.logger.warn({
        event: "refresh_token_reuse_detected",
        account_id: existing.accountId,
        token_id: existing.id,
      })
      await this.revokeChain(existing.id)
      throw new UnauthorizedException("Refresh token reuse detected")
    }

    if (existing.expiresAt < new Date()) {
      this.logger.warn({
        event: "refresh_token_expired",
        account_id: existing.accountId,
        token_id: existing.id,
      })
      await this.revokeSingle(existing.id)
      throw new UnauthorizedException("Refresh token expired")
    }

    const newToken = this.generateOpaqueToken()
    const newTokenHash = this.hashToken(newToken)
    const ttl = this.defaultTtlSeconds()
    const expiresAt = new Date(Date.now() + ttl * 1000)
    const now = new Date()

    await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: existing.id },
        data: { revokedAt: now, lastUsedAt: now },
      }),
      this.prisma.refreshToken.create({
        data: {
          accountId: existing.accountId,
          tokenHash: newTokenHash,
          parentId: existing.id,
          expiresAt,
          sessionRootId: existing.sessionRootId,
          surface: existing.surface,
          browser: existing.browser,
          os: existing.os,
          userAgent: existing.userAgent,
          ipAddress: existing.ipAddress,
          location: existing.location,
          deviceLabel: existing.deviceLabel,
          lastUsedAt: now,
        },
      }),
    ])

    this.logger.log({
      event: "refresh_token_rotated",
      account_id: existing.accountId,
      old_token_id: existing.id,
    })

    return {
      newRefreshToken: newToken,
      accountId: existing.accountId,
      accountType: existing.account.accountType,
      adminRole: existing.account.adminRole,
    }
  }

  async revokeByToken(token: string): Promise<void> {
    const tokenHash = this.hashToken(token)
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    })

    if (!record) {
      this.logger.warn({ event: "refresh_token_revoke_not_found", tokenHash })
      return
    }

    await this.revokeSession(record.accountId, record.sessionRootId)

    this.logger.log({
      event: "refresh_token_revoked",
      account_id: record.accountId,
      session_root_id: record.sessionRootId,
    })
  }

  async listActiveSessions(
    accountId: string,
    currentRefreshToken?: string
  ): Promise<ActiveSession[]> {
    const now = new Date()
    const currentHash = currentRefreshToken
      ? this.hashToken(currentRefreshToken)
      : null

    const activeTokens = await this.prisma.refreshToken.findMany({
      where: {
        accountId,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { issuedAt: "desc" },
    })

    const latestByRoot = new Map<string, (typeof activeTokens)[number]>()
    for (const token of activeTokens) {
      if (!latestByRoot.has(token.sessionRootId)) {
        latestByRoot.set(token.sessionRootId, token)
      }
    }

    const sessions: ActiveSession[] = []

    for (const [sessionRootId, latest] of latestByRoot) {
      const origin = await this.prisma.refreshToken.findFirst({
        where: { sessionRootId, accountId },
        orderBy: { issuedAt: "asc" },
      })
      if (!origin) continue

      const device = formatSessionDeviceLabel({
        deviceLabel: origin.deviceLabel,
        os: origin.os,
        browser: origin.browser,
      })

      const browserParts = [
        origin.surface === "mobile" ? "Sable iOS" : origin.browser,
        origin.location,
      ].filter(Boolean)

      sessions.push({
        id: sessionRootId,
        device,
        location: origin.location ?? "Unknown",
        browser: browserParts.join(" · "),
        lastActiveAt: (latest.lastUsedAt ?? latest.issuedAt).toISOString(),
        current: currentHash === latest.tokenHash,
      })
    }

    return sessions.sort(
      (a, b) =>
        new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
    )
  }

  async revokeSession(accountId: string, sessionRootId: string): Promise<void> {
    const result = await this.prisma.refreshToken.updateMany({
      where: {
        accountId,
        sessionRootId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    })

    if (result.count === 0) {
      throw new NotFoundException("Session not found")
    }

    this.logger.log({
      event: "session_revoked",
      account_id: accountId,
      session_root_id: sessionRootId,
      revoked_count: result.count,
    })
  }

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

  private async revokeSingle(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    })
  }

  private async revokeChain(rootId: string): Promise<void> {
    const toRevoke: string[] = [rootId]
    const visited = new Set<string>()

    while (toRevoke.length > 0) {
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
}
