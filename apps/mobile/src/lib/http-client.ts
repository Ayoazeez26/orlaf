/**
 * KAN-13 — Shared HTTP client
 *
 * - Attaches Authorization Bearer from in-memory access token
 * - Proactively refreshes when token exp is within 60s of now
 * - On 401: calls POST /auth/refresh once, retries original request
 * - On 401 from /auth/refresh: clears storage, routes to sign-in
 * - Deduplicates concurrent refresh attempts
 *
 * TODO(KAN-53): attach W3C traceparent header to every outgoing request
 */

import { router } from "expo-router"
import { TokenStore } from "../services/token-store.service"

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.sable.app"
const REFRESH_EXPIRY_BUFFER_SECONDS = 60

// ---------------------------------------------------------------------------
// In-memory token state
// ---------------------------------------------------------------------------

let inMemoryAccessToken: string | null = null
let refreshPromise: Promise<string | null> | null = null

export async function initHttpClient(): Promise<void> {
  inMemoryAccessToken = await TokenStore.getAccessToken()
}

export function setInMemoryAccessToken(token: string | null): void {
  inMemoryAccessToken = token
}

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------

function getTokenExp(token: string): number | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    )
    return typeof payload.exp === "number" ? payload.exp : null
  } catch {
    return null
  }
}

function isTokenExpiringSoon(token: string): boolean {
  const exp = getTokenExp(token)
  if (!exp) return true
  return Date.now() / 1000 > exp - REFRESH_EXPIRY_BUFFER_SECONDS
}

// ---------------------------------------------------------------------------
// Refresh
// ---------------------------------------------------------------------------

async function doRefresh(): Promise<string | null> {
  const refreshToken = await TokenStore.getRefreshToken()
  if (!refreshToken) return null

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (response.status === 401) {
    // Session fully expired — sign out
    await signOutAndRedirect()
    return null
  }

  if (!response.ok) return null

  const data = await response.json()
  const newAccessToken: string = data.access_token
  const newRefreshToken: string = data.refresh_token

  await TokenStore.saveTokens(newAccessToken, newRefreshToken)
  setInMemoryAccessToken(newAccessToken)

  return newAccessToken
}

/**
 * Serialized refresh — concurrent callers share the same promise.
 */
async function refreshOnce(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = doRefresh().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

async function signOutAndRedirect(): Promise<void> {
  await TokenStore.clearTokens()
  setInMemoryAccessToken(null)
  // TODO(KAN-53): Sentry.addBreadcrumb({ message: "Session expired, signing out" })
  router.replace("/auth/sign-in")
}

// ---------------------------------------------------------------------------
// Main fetch wrapper
// ---------------------------------------------------------------------------

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // Proactive refresh
  if (inMemoryAccessToken && isTokenExpiringSoon(inMemoryAccessToken)) {
    const refreshed = await refreshOnce()
    if (refreshed) inMemoryAccessToken = refreshed
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
    // TODO(KAN-53): "traceparent": generateTraceparent(),
  }

  if (inMemoryAccessToken) {
    headers.Authorization = `Bearer ${inMemoryAccessToken}`
  }

  const url = `${API_BASE_URL}${path}`
  let response = await fetch(url, { ...options, headers })

  // Reactive refresh on 401
  if (response.status === 401 && !path.includes("/auth/refresh")) {
    const newToken = await refreshOnce()

    if (!newToken) {
      throw new ApiError(401, "Session expired")
    }

    headers.Authorization = `Bearer ${newToken}`
    response = await fetch(url, { ...options, headers })
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError(response.status, body?.message ?? "Request failed", body)
  }

  // 204 No Content
  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Sign-out (called from settings)
// ---------------------------------------------------------------------------

export async function signOut(): Promise<void> {
  try {
    const refreshToken = await TokenStore.getRefreshToken()
    if (refreshToken) {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(inMemoryAccessToken
            ? { Authorization: `Bearer ${inMemoryAccessToken}` }
            : {}),
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
    }
  } catch {
    // Best effort — always clear local state
  }

  await TokenStore.clearTokens()
  setInMemoryAccessToken(null)
  router.replace("/auth/sign-in")
}

// ---------------------------------------------------------------------------
// Typed error
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}
