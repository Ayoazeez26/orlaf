/**
 * API base URL for browser fetch calls.
 * In dev, returns "" so requests stay same-origin (localhost:3002) and the
 * Vite/Nitro proxy forwards to VITE_API_BASE_URL — required for httpOnly
 * refresh cookies (sable_rt) to be set and sent.
 */
export function getApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return ""
  }

  const raw = import.meta.env.VITE_API_BASE_URL
  if (!raw) {
    throw new Error("VITE_API_BASE_URL must be set for production builds")
  }

  return raw.replace(/\/+$/, "")
}
