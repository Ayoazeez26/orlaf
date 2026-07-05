import type { SignInResponse } from "@sable/contracts"
import { setAccessToken } from "@/lib/http-client"
import { fetchAuthSession, refreshSession } from "../api/auth-api"
import type { AuthSnapshot } from "./auth-snapshot"
import { getAuthSnapshot, setAuthSnapshot } from "./auth-snapshot"
import { markOnboardingComplete } from "./onboarding-complete"

let readyPromise: Promise<AuthSnapshot> | null = null
let clientInitialized = false

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
  clientInitialized = false
}

/**
 * Route guards and AuthProvider await this.
 * SSR must not bootstrap (no cookies) — client always re-runs with browser cookies.
 */
export function getAuthReady(): Promise<AuthSnapshot> {
  if (typeof window === "undefined") {
    return Promise.resolve({ status: "loading", session: null })
  }

  if (!clientInitialized) {
    clientInitialized = true
    setAuthSnapshot({ status: "loading", session: null })
    readyPromise = null
  }

  const current = getAuthSnapshot()
  if (current.status !== "loading") {
    return Promise.resolve(current)
  }

  if (!readyPromise) {
    readyPromise = runBootstrap()
  }
  return readyPromise
}
