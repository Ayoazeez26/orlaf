import type { AdminSignInResponse } from "@sable/contracts"
import { setAccessToken } from "@/lib/http-client"
import { fetchAdminSession, refreshSession } from "../api/auth-api"
import {
  resetAuthBootstrapProgress,
  setAuthBootstrapProgress,
} from "./auth-bootstrap-progress"
import type { AuthSnapshot } from "./auth-snapshot"
import { getAuthSnapshot, setAuthSnapshot } from "./auth-snapshot"
import type { AdminSession } from "./admin-session"

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
    const metadata = await fetchAdminSession()
    setAuthBootstrapProgress(90)
    const session: AdminSession = { ...metadata, access_token }

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

export function clearAuthBootstrapCache(): void {
  readyPromise = null
}

export function getAuthReady(): Promise<AuthSnapshot> {
  if (typeof window === "undefined") {
    return Promise.resolve({ status: "loading", session: null })
  }

  const current = getAuthSnapshot()
  if (current.status !== "loading") {
    return Promise.resolve(current)
  }

  if (!clientInitialized) {
    clientInitialized = true
    resetAuthBootstrapProgress()
    readyPromise = null
  }

  if (!readyPromise) {
    readyPromise = runBootstrap()
  }
  return readyPromise
}
