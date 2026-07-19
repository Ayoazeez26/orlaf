/** Legacy shared cookie — read-only fallback for existing sessions. */
export const REFRESH_COOKIE_NAME_LEGACY = "sable_rt"

/** creator-web refresh cookie */
export const REFRESH_COOKIE_NAME_CREATOR = "sable_rt_creator"

/** admin-web refresh cookie */
export const REFRESH_COOKIE_NAME_ADMIN = "sable_rt_admin"

/** @deprecated Use REFRESH_COOKIE_NAME_CREATOR or REFRESH_COOKIE_NAME_ADMIN */
export const REFRESH_COOKIE_NAME = REFRESH_COOKIE_NAME_LEGACY

/** Site-wide path so the cookie is sent on refresh and other API routes. */
export const REFRESH_COOKIE_PATH = "/"
export const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export type WebRefreshClient = "creator" | "admin"

export function refreshCookieNameForClient(client: WebRefreshClient): string {
  return client === "admin"
    ? REFRESH_COOKIE_NAME_ADMIN
    : REFRESH_COOKIE_NAME_CREATOR
}

export function refreshCookieNameForAccountType(accountType: string): string {
  return accountType === "admin"
    ? REFRESH_COOKIE_NAME_ADMIN
    : REFRESH_COOKIE_NAME_CREATOR
}

export function webRefreshClientFromHint(
  accountType?: "user" | "creator" | "admin"
): WebRefreshClient {
  return accountType === "admin" ? "admin" : "creator"
}

export function readWebRefreshToken(
  cookies: Record<string, string | undefined> | undefined,
  client: WebRefreshClient
): string | undefined {
  const primary = refreshCookieNameForClient(client)
  return cookies?.[primary] ?? cookies?.[REFRESH_COOKIE_NAME_LEGACY]
}

export function clearWebRefreshCookies(
  res: { clearCookie: (name: string, options: { path: string }) => void },
  client?: WebRefreshClient
) {
  const names = client
    ? [refreshCookieNameForClient(client), REFRESH_COOKIE_NAME_LEGACY]
    : [
        REFRESH_COOKIE_NAME_CREATOR,
        REFRESH_COOKIE_NAME_ADMIN,
        REFRESH_COOKIE_NAME_LEGACY,
      ]

  for (const name of names) {
    res.clearCookie(name, { path: REFRESH_COOKIE_PATH })
  }
}

export function buildRefreshCookieOptions(
  maxAgeMs = REFRESH_COOKIE_MAX_AGE_MS
) {
  const isProduction = process.env.NODE_ENV === "production"

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    path: REFRESH_COOKIE_PATH,
    maxAge: maxAgeMs,
  }
}
