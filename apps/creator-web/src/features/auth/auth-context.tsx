import type { SignInResponse } from "@sable/contracts"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { getOnboardingStatus } from "@/features/onboarding/api/onboarding-api"
import { clearOnboardingProgress } from "@/features/onboarding/onboarding-context"
import {
  getAccessToken,
  setAccessToken,
  setOnSessionExpired,
} from "@/lib/http-client"
import { getRouter } from "@/router"
import type {
  SignInEmailResult,
  SignUpEmailResult,
  VerifyEmailResult,
  VerifyMfaResult,
} from "./api/auth-api"
import {
  logout as logoutApi,
  signInWithEmail as signInWithEmailApi,
  signInWithGoogle as signInWithGoogleApi,
  signUpWithEmail as signUpWithEmailApi,
  verifyEmail as verifyEmailApi,
  verifyMfa as verifyMfaApi,
} from "./api/auth-api"
import { useAuthBootstrapProgress } from "./hooks/use-auth-bootstrap-progress"
import { clearAuthBootstrapCache, getAuthReady } from "./lib/auth-bootstrap"
import { getAuthSnapshot, setAuthSnapshot } from "./lib/auth-snapshot"
import { clearOnboardingComplete } from "./lib/onboarding-complete"
import {
  onboardingStepFromApi,
  resolvePostSignInRoute,
} from "./lib/post-sign-in-route"

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
    | { outcome: "requires_2fa"; mfaToken: string }
    | { outcome: "conflict"; provider: string }
    | { outcome: "verification_failed" }
    | { outcome: "error"; message: string }
  >
  verifyMfaAndSignIn: (
    mfaToken: string,
    code: string
  ) => Promise<VerifyMfaResult>
  signUpWithEmail: (
    input: Parameters<typeof signUpWithEmailApi>[0]
  ) => Promise<SignUpEmailResult>
  verifyEmailAndSignIn: (
    verificationId: string,
    code: string
  ) => Promise<VerifyEmailResult>
  signInWithEmail: (
    input: Parameters<typeof signInWithEmailApi>[0]
  ) => Promise<SignInEmailResult>
  updateSession: (patch: Partial<SignInResponse>) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

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
  }, [])

  const applyUnauthenticated = useCallback(() => {
    setSession(null)
    setStatus("unauthenticated")
    setAccessToken(null)
    syncSnapshot("unauthenticated", null)
  }, [])

  const updateSession = useCallback((patch: Partial<SignInResponse>) => {
    setSession((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      syncSnapshot("authenticated", next)
      return next
    })
  }, [])

  const navigateAfterSignIn = useCallback(
    async (nextSession: SignInResponse) => {
      let onboardingStep = null
      if (
        nextSession.account_state === "onboarding" &&
        !nextSession.needs_consent
      ) {
        try {
          const status = await getOnboardingStatus()
          onboardingStep = onboardingStepFromApi(status)
        } catch {
          onboardingStep = null
        }
      }

      const destination = resolvePostSignInRoute(nextSession, onboardingStep)
      if (destination.search?.step) {
        void getRouter().navigate({
          to: destination.to,
          search: destination.search,
          replace: true,
        })
      } else {
        void getRouter().navigate({ to: destination.to, replace: true })
      }
    },
    []
  )

  const completeSignIn = useCallback(
    async (nextSession: SignInResponse) => {
      setAccessToken(nextSession.access_token)
      clearAuthBootstrapCache()
      applyAuthenticated(nextSession)
      await navigateAfterSignIn(nextSession)
    },
    [applyAuthenticated, navigateAfterSignIn]
  )

  useEffect(() => {
    setOnSessionExpired(() => {
      applyUnauthenticated()
      clearAuthBootstrapCache()
      void getRouter().navigate({ to: "/onboarding", replace: true })
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

  const signInWithGoogle = useCallback(
    async (idToken: string) => {
      const result = await signInWithGoogleApi(idToken)

      if (result.outcome === "requires_2fa") {
        return result
      }

      if (result.outcome !== "success") {
        return result
      }

      await completeSignIn(result.data)
      return { outcome: "success" as const }
    },
    [completeSignIn]
  )

  const verifyMfaAndSignIn = useCallback(
    async (mfaToken: string, code: string) => {
      const result = await verifyMfaApi({ mfa_token: mfaToken, code })

      if (result.outcome === "success") {
        await completeSignIn(result.data)
      }

      return result
    },
    [completeSignIn]
  )

  const signUpWithEmail = useCallback(
    (input: Parameters<typeof signUpWithEmailApi>[0]) =>
      signUpWithEmailApi(input),
    []
  )

  const verifyEmailAndSignIn = useCallback(
    async (verificationId: string, code: string) => {
      const result = await verifyEmailApi({
        verification_id: verificationId,
        code,
        surface: "creator-web",
      })

      if (result.outcome === "requires_2fa") {
        return result
      }

      if (result.outcome === "success") {
        await completeSignIn(result.data)
      }

      return result
    },
    [completeSignIn]
  )

  const signInWithEmail = useCallback(
    async (input: Parameters<typeof signInWithEmailApi>[0]) => {
      const result = await signInWithEmailApi(input)

      if (result.outcome === "requires_2fa") {
        return result
      }

      if (result.outcome === "success") {
        await completeSignIn(result.data)
      }

      return result
    },
    [completeSignIn]
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
      clearOnboardingProgress()
      clearAuthBootstrapCache()
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
      verifyMfaAndSignIn,
      signUpWithEmail,
      verifyEmailAndSignIn,
      signInWithEmail,
      updateSession,
      signOut,
    }),
    [
      status,
      session,
      signInWithGoogle,
      verifyMfaAndSignIn,
      signUpWithEmail,
      verifyEmailAndSignIn,
      signInWithEmail,
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

export function useAuthOptional() {
  return useContext(AuthContext)
}
