import type { SignInResponse } from "@sable/contracts"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  getAccessToken,
  setAccessToken,
  setOnSessionExpired,
} from "@/lib/http-client"
import { getRouter } from "@/router"
import {
  logout as logoutApi,
  refreshSession,
  signInWithGoogle as signInWithGoogleApi,
} from "./api/auth-api"
import { AUTH_SESSION_STORAGE_KEY } from "./constants"
import { getAuthSnapshot, setAuthSnapshot } from "./lib/auth-snapshot"
import { clearOnboardingComplete } from "./lib/onboarding-complete"
import { resolvePostSignInRoute } from "./lib/post-sign-in-route"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  status: AuthStatus
  isAuthenticated: boolean
  isLoading: boolean
  session: SignInResponse | null
  signInWithGoogle: (
    idToken: string
  ) => Promise<
    | { outcome: "success" }
    | { outcome: "conflict"; provider: string }
    | { outcome: "verification_failed" }
    | { outcome: "error"; message: string }
  >
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function persistSession(session: SignInResponse) {
  sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}

function loadPersistedSession(): SignInResponse | null {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SignInResponse
  } catch {
    return null
  }
}

function clearPersistedSession() {
  sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}

function syncSnapshot(status: AuthStatus, session: SignInResponse | null) {
  setAuthSnapshot({ status, session })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SignInResponse | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  const applyAuthenticated = useCallback((nextSession: SignInResponse) => {
    setSession(nextSession)
    setStatus("authenticated")
    syncSnapshot("authenticated", nextSession)
    persistSession(nextSession)
  }, [])

  const applyUnauthenticated = useCallback(() => {
    setSession(null)
    setStatus("unauthenticated")
    setAccessToken(null)
    clearPersistedSession()
    syncSnapshot("unauthenticated", null)
  }, [])

  useEffect(() => {
    setOnSessionExpired(() => {
      applyUnauthenticated()
      void getRouter().navigate({ to: "/onboarding", replace: true })
    })
    return () => setOnSessionExpired(null)
  }, [applyUnauthenticated])

  useEffect(() => {
    async function bootstrap() {
      try {
        const { access_token } = await refreshSession()
        setAccessToken(access_token)
        const persisted = loadPersistedSession()
        if (persisted) {
          applyAuthenticated(persisted)
        } else {
          setStatus("authenticated")
          syncSnapshot("authenticated", null)
        }
      } catch {
        applyUnauthenticated()
      }
    }

    bootstrap()
  }, [applyAuthenticated, applyUnauthenticated])

  const signInWithGoogle = useCallback(
    async (idToken: string) => {
      const result = await signInWithGoogleApi(idToken)

      if (result.outcome !== "success") {
        return result
      }

      setAccessToken(result.data.access_token)
      applyAuthenticated(result.data)

      const destination = resolvePostSignInRoute(result.data)
      if (destination.search?.step) {
        void getRouter().navigate({
          to: destination.to,
          search: destination.search,
          replace: true,
        })
      } else {
        void getRouter().navigate({ to: destination.to, replace: true })
      }

      return { outcome: "success" as const }
    },
    [applyAuthenticated]
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
      clearOnboardingComplete()
      void getRouter().navigate({ to: "/onboarding", replace: true })
    }
  }, [applyUnauthenticated])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      session,
      signInWithGoogle,
      signOut,
    }),
    [status, session, signInWithGoogle, signOut]
  )

  if (status === "loading") {
    return <AuthBootstrapFallback />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function AuthBootstrapFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <p className="text-muted-foreground text-sm">Loading…</p>
    </div>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

export function useAuthOptional() {
  return useContext(AuthContext)
}
