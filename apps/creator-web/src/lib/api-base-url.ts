export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"
  return raw.replace(/\/+$/, "")
}
