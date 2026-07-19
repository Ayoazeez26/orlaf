/**
 * API base URL for browser fetch calls.
 *
 * Always same-origin ("") so the browser calls `/api/**` on this app's own
 * origin, and the app server (Nitro `routeRules` proxy — see vite.config.ts)
 * forwards to the backend (VITE_API_BASE_URL). This keeps the httpOnly refresh
 * cookie (sable_rt_admin) FIRST-PARTY.
 *
 * Calling the backend cross-site directly (e.g. vercel.app → onrender.com)
 * makes sable_rt_admin a third-party cookie, which browsers (notably mobile Safari
 * ITP) block — causing `/auth/refresh` to 401 and the app to report a lost
 * session mid-use.
 */
export function getApiBaseUrl(): string {
  return ""
}
