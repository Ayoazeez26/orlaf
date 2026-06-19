export const REFRESH_COOKIE_NAME = "sable_rt"
/** Must prefix-match API routes under /api/v1/auth/* */
export const REFRESH_COOKIE_PATH = "/api/v1/auth"
export const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export function buildRefreshCookieOptions(
  maxAgeMs = REFRESH_COOKIE_MAX_AGE_MS
) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: REFRESH_COOKIE_PATH,
    maxAge: maxAgeMs,
  }
}
