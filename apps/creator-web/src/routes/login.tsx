import {
  ClientOnly,
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { Separator } from "@workspace/ui/components/separator"
import { useEffect, useState } from "react"
import { z } from "zod"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { SableBrandMark } from "@/components/sable-brand-mark"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { EmailSignInForm } from "@/features/auth/components/email-sign-in-form"
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"
import {
  OnboardingProvider,
  useOnboarding,
} from "@/features/onboarding/onboarding-context"
import { toastApiError } from "@/lib/toast"

const loginSearchSchema = z.object({
  reset: z.enum(["success"]).optional(),
})

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: loginSearchSchema,
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()
    if (status === "loading" || status !== "authenticated" || !session) return

    const destination = resolvePostSignInRoute(session)
    if (destination.search?.step) {
      throw redirect({ to: destination.to, search: destination.search })
    }
    throw redirect({ to: destination.to })
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <ClientOnly fallback={<LoginFallback />}>
      <OnboardingProvider>
        <LoginContent />
      </OnboardingProvider>
    </ClientOnly>
  )
}

function LoginContent() {
  const navigate = useNavigate()
  const { reset } = Route.useSearch()
  const { dispatch } = useOnboarding()
  const [resetSuccessVisible, setResetSuccessVisible] = useState(
    reset === "success"
  )

  useEffect(() => {
    if (reset !== "success") return

    setResetSuccessVisible(true)
    void navigate({ to: "/login", search: {}, replace: true })
  }, [navigate, reset])

  const handleUnverified = (verificationId: string | null) => {
    dispatch({ type: "SET_AUTH_METHOD", payload: "email" })
    if (verificationId) {
      dispatch({
        type: "SET_VERIFICATION_META",
        payload: { verificationId, maskedEmail: "" },
      })
    }
    void navigate({
      to: "/onboarding",
      search: { step: "verify" },
    })
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8">
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end sm:left-auto">
        <ThemeSwitcher compact />
      </div>
      <SableBrandMark className="mb-6" subtitle="Creators" />
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="font-semibold text-xl sm:text-2xl">Welcome back</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Sign in to your creator studio
          </p>
        </div>

        {resetSuccessVisible && (
          <p
            className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-emerald-900 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100"
            role="status"
          >
            Your password was reset. Sign in with your new password.
          </p>
        )}

        <div className="mt-8">
          <GoogleSignInButton onError={toastApiError} />
        </div>

        <div className="relative my-6">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-muted-foreground text-xs">
            or
          </span>
        </div>

        <EmailSignInForm
          onError={toastApiError}
          onUnverified={handleUnverified}
        />
        <p className="mt-6 text-center text-muted-foreground text-sm">
          New here?{" "}
          <Link to="/onboarding" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <AppLoadingScreen
      mode="simulated"
      title="Loading sign in"
      message="Preparing your studio…"
    />
  )
}
