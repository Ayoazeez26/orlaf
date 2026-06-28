import {
  ClientOnly,
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { Separator } from "@workspace/ui/components/separator"
import { useState } from "react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { EmailSignInForm } from "@/features/auth/components/email-sign-in-form"
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"
import {
  OnboardingProvider,
  useOnboarding,
} from "@/features/onboarding/onboarding-context"

export const Route = createFileRoute("/login")({
  ssr: false,
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()
    if (status !== "authenticated" || !session) return

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
  const { dispatch } = useOnboarding()
  const [authError, setAuthError] = useState<string | null>(null)

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
      <p className="mb-6 font-semibold text-foreground text-lg">
        <span className="font-bold">OrlAf</span>{" "}
        <span className="text-muted-foreground">Creators</span>
      </p>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="font-semibold text-xl sm:text-2xl">Welcome back</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Sign in to your creator studio
          </p>
        </div>
        <div className="mt-8">
          <GoogleSignInButton onError={setAuthError} />
        </div>

        <div className="relative my-6">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-muted-foreground text-xs">
            or
          </span>
        </div>

        <EmailSignInForm
          onError={setAuthError}
          onUnverified={handleUnverified}
        />

        {authError && (
          <p className="mt-4 text-center text-destructive text-sm" role="alert">
            {authError}
          </p>
        )}
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
    <div className="flex min-h-svh items-center justify-center bg-background">
      <p className="text-muted-foreground text-sm">Loading…</p>
    </div>
  )
}
