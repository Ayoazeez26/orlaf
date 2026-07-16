import type { AdminSignInResponse } from "@sable/contracts"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import {
  getAccessToken,
  setAccessToken,
  setOnSessionExpired,
} from "@/lib/http-client"
import { getRouter } from "@/router"
import type { SignInAdminResult } from "./api/auth-api"
import {
  changeAdminPassword as changeAdminPasswordApi,
  logout as logoutApi,
  signInAdmin as signInAdminApi,
} from "./api/auth-api"
import { useAuthBootstrapProgress } from "./hooks/use-auth-bootstrap-progress"
import { clearAuthBootstrapCache, getAuthReady } from "./lib/auth-bootstrap"
import type { AdminSession } from "./lib/admin-session"
import { toAdminSession } from "./lib/admin-session"
import { getAuthSnapshot, setAuthSnapshot } from "./lib/auth-snapshot"
import { resolvePostSignInRoute } from "./lib/post-sign-in-route"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  status: AuthStatus
  isAuthenticated: boolean
  isLoading: boolean
  session: AdminSession | null
  signInWithEmail: (
    input: Parameters<typeof signInAdminApi>[0]
  ) => Promise<SignInAdminResult>
  changePassword: (
    input: Parameters<typeof changeAdminPasswordApi>[0]
  ) => Promise<void>
  updateSession: (patch: Partial<AdminSession>) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function syncSnapshot(status: AuthStatus, session: AdminSession | null) {
  setAuthSnapshot({ status, session })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  const applyAuthenticated = useCallback((nextSession: AdminSession) => {
    setSession(nextSession)
    setStatus("authenticated")
    syncSnapshot("authenticated", nextSession)
  }, [])

  const applyUnauthenticated = useCallback(() => {
    setSession(null)
    setStatus("unauthenticated")
    setAccessToken(null)
    syncSnapshot("unauthenticated", null)
  }, [])

  const updateSession = useCallback((patch: Partial<AdminSession>) => {
    setSession((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      syncSnapshot("authenticated", next)
      return next
    })
  }, [])

  const navigateAfterSignIn = useCallback((nextSession: AdminSession) => {
    const destination = resolvePostSignInRoute(nextSession)
    if (destination.params) {
      void getRouter().navigate({
        to: destination.to,
        params: destination.params,
        replace: true,
      })
    } else {
      void getRouter().navigate({ to: destination.to, replace: true })
    }
  }, [])

  const completeSignIn = useCallback(
    async (nextSession: AdminSignInResponse) => {
      setAccessToken(nextSession.access_token)
      clearAuthBootstrapCache()
      applyAuthenticated(toAdminSession(nextSession))
      await navigateAfterSignIn(toAdminSession(nextSession))
    },
    [applyAuthenticated, navigateAfterSignIn]
  )

  useEffect(() => {
    setOnSessionExpired(() => {
      applyUnauthenticated()
      clearAuthBootstrapCache()
      void getRouter().navigate({ to: "/login", replace: true })
    })
    return () => setOnSessionExpired(null)
  }, [applyUnauthenticated])

  useEffect(() => {
    let active = true

    getAuthReady().then((result) => {
      if (!active) return

      const live = getAuthSnapshot()
      const resolved = live.status !== "loading" ? live : result

      if (resolved.status === "authenticated" && resolved.session) {
        applyAuthenticated(resolved.session)
      } else {
        applyUnauthenticated()
      }
    })

    return () => {
      active = false
    }
  }, [applyAuthenticated, applyUnauthenticated])

  const signInWithEmail = useCallback(
    async (input: Parameters<typeof signInAdminApi>[0]) => {
      const result = await signInAdminApi(input)

      if (result.outcome === "success") {
        await completeSignIn(result.data)
      }

      return result
    },
    [completeSignIn]
  )

  const changePassword = useCallback(
    async (input: Parameters<typeof changeAdminPasswordApi>[0]) => {
      await changeAdminPasswordApi(input)
      updateSession({ must_change_password: false })
      if (session) {
        navigateAfterSignIn({ ...session, must_change_password: false })
      }
    },
    [navigateAfterSignIn, session, updateSession]
  )

  const signOut = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await logoutApi()
      }
    } catch {
      // Best effort
    } finally {
      applyUnauthenticated()
      clearAuthBootstrapCache()
      void getRouter().navigate({ to: "/login", replace: true })
    }
  }, [applyUnauthenticated])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      session,
      signInWithEmail,
      changePassword,
      updateSession,
      signOut,
    }),
    [
      status,
      session,
      signInWithEmail,
      changePassword,
      updateSession,
      signOut,
    ]
  )

  if (status === "loading") {
    return <AuthBootstrapFallback />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function AuthBootstrapFallback() {
  const progress = useAuthBootstrapProgress()

  return (
    <AppLoadingScreen
      progress={progress}
      title="Signing you in"
      message="Checking your session…"
      subtitle="Admin"
    />
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
