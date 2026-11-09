import {
  ClientOnly,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { z } from "zod"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { SableBrandMark } from "@/components/sable-brand-mark"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { AdminSignInForm } from "@/features/auth/components/admin-sign-in-form"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"

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
    if (destination.params) {
      throw redirect({ to: destination.to, params: destination.params })
    }
    throw redirect({ to: destination.to })
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <ClientOnly fallback={<LoginFallback />}>
      <LoginContent />
    </ClientOnly>
  )
}

function LoginContent() {
  const navigate = useNavigate()
  const { reset } = Route.useSearch()
  const [authError, setAuthError] = useState<string | null>(null)
  const [resetSuccessVisible, setResetSuccessVisible] = useState(
    reset === "success"
  )

  useEffect(() => {
    if (reset !== "success") return

    setResetSuccessVisible(true)
    void navigate({ to: "/login", search: {}, replace: true })
  }, [navigate, reset])

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8">
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end sm:left-auto">
        <ThemeSwitcher compact />
      </div>
      <SableBrandMark className="mb-6" subtitle="Admin" />
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="font-semibold text-xl sm:text-2xl">Admin sign in</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Sign in to the Sable TV admin console
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
          <AdminSignInForm onError={setAuthError} />
        </div>

        {authError ? (
          <p className="mt-4 text-center text-destructive text-sm" role="alert">
            {authError}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <AppLoadingScreen
      title="Loading sign in"
      message="Preparing admin console…"
      subtitle="Admin"
    />
  )
}
