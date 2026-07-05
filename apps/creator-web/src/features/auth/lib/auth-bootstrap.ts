import type { SignInResponse } from "@sable/contracts"
import { setAccessToken } from "@/lib/http-client"
import { fetchAuthSession, refreshSession } from "../api/auth-api"
import type { AuthSnapshot } from "./auth-snapshot"
import { getAuthSnapshot, setAuthSnapshot } from "./auth-snapshot"
import { markOnboardingComplete } from "./onboarding-complete"

let readyPromise: Promise<AuthSnapshot> | null = null

async function runBootstrap(): Promise<AuthSnapshot> {
  try {
    const { access_token } = await refreshSession()
    setAccessToken(access_token)

    const metadata = await fetchAuthSession()
    const session: SignInResponse = { ...metadata, access_token }

    if (session.account_state === "active") {
      markOnboardingComplete()
    }

    const snapshot: AuthSnapshot = { status: "authenticated", session }
    setAuthSnapshot(snapshot)
    return snapshot
  } catch {
    setAccessToken(null)
    const snapshot: AuthSnapshot = { status: "unauthenticated", session: null }
    setAuthSnapshot(snapshot)
    return snapshot
  }
}

/** Drop the cached bootstrap promise after sign-in / sign-out. */
export function clearAuthBootstrapCache(): void {
  readyPromise = null
}

/**
 * Route guards and AuthProvider await this. After the first bootstrap, returns
 * the live in-memory snapshot so sign-out is not overridden by a stale promise.
 */
export function getAuthReady(): Promise<AuthSnapshot> {
  const current = getAuthSnapshot()
  if (current.status !== "loading") {
    return Promise.resolve(current)
  }

  if (!readyPromise) {
    readyPromise = runBootstrap()
  }
  return readyPromise
}
