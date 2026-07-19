/**
 * Shared HTTP client for creator-web.
 * Uses httpOnly refresh cookie (sable_rt_creator) + in-memory access token.
 */

import { getApiBaseUrl } from "./api-base-url"

const API_BASE_URL = getApiBaseUrl()

const REFRESH_EXPIRY_BUFFER_SECONDS = 60

let inMemoryAccessToken: string | null = null
let refreshPromise: Promise<string | null> | null = null
let onSessionExpired: (() => void) | null = null

export function setOnSessionExpired(handler: (() => void) | null) {
  onSessionExpired = handler
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken
}

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token
}

function getTokenExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? ""))
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

/** Low-level fetch wrapper — always sends cookies (sable_rt_creator). */
export function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`
  return fetch(url, {
    ...options,
    credentials: "include",
  })
}

async function doRefresh(): Promise<string | null> {
  const response = await apiFetch("/api/v1/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  })

  if (response.status === 401) {
    setAccessToken(null)
    onSessionExpired?.()
    return null
  }

  if (!response.ok) return null

  const data = (await response.json()) as { access_token: string }
  setAccessToken(data.access_token)
  return data.access_token
}

async function refreshOnce(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = doRefresh().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (inMemoryAccessToken && isTokenExpiringSoon(inMemoryAccessToken)) {
    const refreshed = await refreshOnce()
    if (refreshed) inMemoryAccessToken = refreshed
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (inMemoryAccessToken) {
    headers.Authorization = `Bearer ${inMemoryAccessToken}`
  }

  let response = await apiFetch(path, {
    ...options,
    headers,
  })

  if (response.status === 401 && !path.includes("/auth/refresh")) {
    const newToken = await refreshOnce()

    if (!newToken) {
      throw new ApiError(401, "Session expired")
    }

    headers.Authorization = `Bearer ${newToken}`
    response = await apiFetch(path, {
      ...options,
      headers,
    })
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      (body as { message?: string })?.message ?? "Request failed",
      body
    )
  }

  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

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
