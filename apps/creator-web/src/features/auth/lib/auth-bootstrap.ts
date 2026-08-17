import type { SignInResponse } from "@sable/contracts"
import { setAccessToken } from "@/lib/http-client"
import { fetchAuthSession, refreshSession } from "../api/auth-api"
import {
  resetAuthBootstrapProgress,
  setAuthBootstrapProgress,
} from "./auth-bootstrap-progress"
import type { AuthSnapshot } from "./auth-snapshot"
import { getAuthSnapshot, setAuthSnapshot } from "./auth-snapshot"
import { markOnboardingComplete } from "./onboarding-complete"

let readyPromise: Promise<AuthSnapshot> | null = null
let clientInitialized = false

async function runBootstrap(): Promise<AuthSnapshot> {
  setAuthBootstrapProgress(8)

  try {
    setAuthBootstrapProgress(18)
    const { access_token } = await refreshSession()
    setAuthBootstrapProgress(55)
    setAccessToken(access_token)

    setAuthBootstrapProgress(68)
    const metadata = await fetchAuthSession()
    setAuthBootstrapProgress(90)
    const session: SignInResponse = { ...metadata, access_token }

    if (session.account_state === "active") {
      markOnboardingComplete()
    }

    const snapshot: AuthSnapshot = { status: "authenticated", session }
    setAuthSnapshot(snapshot)
    setAuthBootstrapProgress(100)
    return snapshot
  } catch {
    setAccessToken(null)
    const snapshot: AuthSnapshot = { status: "unauthenticated", session: null }
    setAuthSnapshot(snapshot)
    setAuthBootstrapProgress(100)
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
    readyPromise = null

    // A sign-in/sign-out flow may have already written a fresh, resolved
    // snapshot before resetting this cache. Only force a re-bootstrap when
    // there isn't already an up-to-date snapshot to trust.
    if (getAuthSnapshot().status === "loading") {
      resetAuthBootstrapProgress()
      setAuthSnapshot({ status: "loading", session: null })
    }
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
