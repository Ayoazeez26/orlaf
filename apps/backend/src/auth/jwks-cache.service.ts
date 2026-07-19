import { Injectable } from "@nestjs/common"
import { ProviderTokenError, ProviderTokenErrorCode } from "@sable/contracts"
import { CustomLogger } from "@sable/logger"

// TODO(KAN-53): propagate W3C tracecontext on outbound JWKS fetch requests

interface JwksKey {
  kid: string
  kty: string
  use: string
  alg: string
  n?: string
  e?: string
  x?: string
  y?: string
  crv?: string
}

interface CacheEntry {
  keys: JwksKey[]
  expiresAt: number // unix ms
}

@Injectable()
export class JwksCacheService {
  private readonly logger = new CustomLogger(JwksCacheService.name)
  private readonly cache = new Map<string, CacheEntry>()

  /**
   * Returns JWKS keys for the given endpoint.
   * Uses Cache-Control max-age from the provider response.
   * Falls back to a 1-hour TTL if no cache header is present.
   */
  async getKeys(jwksUri: string): Promise<JwksKey[]> {
    const cached = this.cache.get(jwksUri)

    if (cached && Date.now() < cached.expiresAt) {
      this.logger.debug({ event: "jwks_cache_hit", uri: jwksUri })
      return cached.keys
    }

    this.logger.log({ event: "jwks_fetch", uri: jwksUri })

    let response: Response
    try {
      response = await fetch(jwksUri)
    } catch (err) {
      this.logger.error({
        event: "jwks_fetch_failed",
        uri: jwksUri,
        error: (err as Error).message,
      })
      // TODO(KAN-53): Sentry.captureException(err);
      throw new ProviderTokenError(
        `JWKS endpoint unreachable: ${jwksUri}`,
        ProviderTokenErrorCode.JWKS_UNREACHABLE
      )
    }

    if (!response.ok) {
      throw new ProviderTokenError(
        `JWKS endpoint returned ${response.status}`,
        ProviderTokenErrorCode.JWKS_UNREACHABLE
      )
    }

    const ttlSeconds = this.parseCacheControlMaxAge(
      response.headers.get("cache-control")
    )

    const body = (await response.json()) as { keys: JwksKey[] }
    const keys = body.keys ?? []

    this.cache.set(jwksUri, {
      keys,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })

    this.logger.log({
      event: "jwks_cached",
      uri: jwksUri,
      key_count: keys.length,
      ttl_seconds: ttlSeconds,
    })

    return keys
  }

  /** Force-invalidate a cached entry — used when a kid is not found (key rotation) */
  invalidate(jwksUri: string): void {
    this.cache.delete(jwksUri)
    this.logger.log({ event: "jwks_cache_invalidated", uri: jwksUri })
  }

  private parseCacheControlMaxAge(header: string | null): number {
    const FALLBACK_TTL = 3600 // 1 hour
    if (!header) return FALLBACK_TTL
    const match = header.match(/max-age=(\d+)/)
    return match ? parseInt(match[1], 10) : FALLBACK_TTL
  }
}
