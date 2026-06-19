import type { SignInResponse } from "@sable/contracts"

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

export interface AuthSnapshot {
  status: AuthStatus
  session: SignInResponse | null
}

let snapshot: AuthSnapshot = { status: "loading", session: null }

export function getAuthSnapshot(): AuthSnapshot {
  return snapshot
}

export function setAuthSnapshot(next: AuthSnapshot) {
  snapshot = next
}
