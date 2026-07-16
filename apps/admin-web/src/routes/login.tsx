import { ClientOnly, createFileRoute, redirect } from "@tanstack/react-router"
import { useState } from "react"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { SableBrandMark } from "@/components/sable-brand-mark"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { AdminSignInForm } from "@/features/auth/components/admin-sign-in-form"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"

export const Route = createFileRoute("/login")({
  ssr: false,
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
  const [authError, setAuthError] = useState<string | null>(null)

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
