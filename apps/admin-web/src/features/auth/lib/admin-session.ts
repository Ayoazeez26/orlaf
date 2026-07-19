import type {
  AdminSessionResponse,
  AdminSignInResponse,
} from "@sable/contracts"

/** In-memory admin session (tokens may be partial after cookie refresh bootstrap). */
export type AdminSession = AdminSessionResponse & {
  access_token: string
  refresh_token?: string
}

export function toAdminSession(data: AdminSignInResponse): AdminSession {
  return data
}
