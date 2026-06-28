import type { SignInResponse } from "@sable/contracts"
import { setAccessToken } from "@/lib/http-client"
import { fetchAuthSession, refreshSession } from "../api/auth-api"
import type { AuthSnapshot } from "./auth-snapshot"
import { setAuthSnapshot } from "./auth-snapshot"
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

/**
 * Runs the refresh-token + session check exactly once per page load and
 * resolves with the result. Route `beforeLoad` hooks and `AuthProvider` both
 * await this so neither acts on a stale/default "loading" snapshot.
 */
export function getAuthReady(): Promise<AuthSnapshot> {
  if (!readyPromise) {
    readyPromise = runBootstrap()
  }
  return readyPromise
}
