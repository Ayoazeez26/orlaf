import type { AdminSession } from "./admin-session"

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

export interface AuthSnapshot {
  status: AuthStatus
  session: AdminSession | null
}

let snapshot: AuthSnapshot = { status: "loading", session: null }

export function getAuthSnapshot(): AuthSnapshot {
  return snapshot
}

export function setAuthSnapshot(next: AuthSnapshot) {
  snapshot = next
}
