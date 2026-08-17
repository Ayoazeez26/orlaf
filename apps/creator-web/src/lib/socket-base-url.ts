/**
 * Backend origin for WebSocket connections (support inbox realtime).
 *
 * Unlike getApiBaseUrl(), this connects the browser DIRECTLY to the backend
 * rather than through the same-origin Nitro proxy — the proxy path exists to
 * keep the httpOnly refresh cookie first-party, but sockets authenticate with
 * the in-memory bearer token instead of a cookie, so that constraint doesn't
 * apply and a direct connection avoids needing WebSocket upgrade support in
 * the dev/prod proxy layer.
 */
export function getSocketBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    ""
  )
}
