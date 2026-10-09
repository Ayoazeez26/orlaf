import { ClientOnly, createFileRoute, redirect } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { SableBrandMark } from "@/components/sable-brand-mark"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { enableTotp, setupTotp } from "@/features/auth/api/security-api"
import { useAuth } from "@/features/auth/auth-context"
import { AdminTotpSetupPanel } from "@/features/auth/components/admin-totp-setup-panel"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"
import { getRouter } from "@/router"

export const Route = createFileRoute("/setup-2fa")({
  ssr: false,
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()

    if (status === "loading") return

    if (status !== "authenticated" || !session) {
      throw redirect({ to: "/login" })
    }

    if (session.must_change_password) {
      throw redirect({ to: "/change-password" })
    }

    if (!session.must_setup_2fa) {
      const destination = resolvePostSignInRoute(session)
      if (destination.params) {
        throw redirect({ to: destination.to, params: destination.params })
      }
      throw redirect({ to: destination.to })
    }
  },
  component: Setup2faPage,
})

function Setup2faPage() {
  return (
    <ClientOnly fallback={<Setup2faFallback />}>
      <Setup2faContent />
    </ClientOnly>
  )
}

function Setup2faContent() {
  const { session, updateSession } = useAuth()
  const [setup, setSetup] = useState<{
    otpauthUrl: string
    secret: string
  } | null>(null)
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setupTotp()
      .then((response) => {
        if (active) {
          setSetup({ otpauthUrl: response.otpauthUrl, secret: response.secret })
        }
      })
      .catch(() => {
        if (active) {
          setError("Unable to start authenticator setup. Please try again.")
        }
      })
    return () => {
      active = false
    }
  }, [])

  async function handleEnable() {
    setError(null)
    setIsSubmitting(true)
    try {
      await enableTotp({ code })
      updateSession({ must_setup_2fa: false })
      if (!session) return
      const destination = resolvePostSignInRoute({
        ...session,
        must_setup_2fa: false,
      })
      if (destination.params) {
        void getRouter().navigate({
          to: destination.to,
          params: destination.params,
          replace: true,
        })
      } else {
        void getRouter().navigate({ to: destination.to, replace: true })
      }
    } catch {
      setError("Invalid code. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8">
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end sm:left-auto">
        <ThemeSwitcher compact />
      </div>
      <SableBrandMark className="mb-6" subtitle="Admin" />
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="font-semibold text-xl sm:text-2xl">
            Set up two-factor authentication
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Sable now requires all admins to enrol an authenticator app before
            continuing.
          </p>
        </div>

        <div className="mt-8">
          {setup ? (
            <AdminTotpSetupPanel
              otpauthUrl={setup.otpauthUrl}
              secret={setup.secret}
              code={code}
              onCodeChange={setCode}
            />
          ) : null}

          {error ? (
            <p className="mt-4 text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}

          {setup ? (
            <Button
              type="button"
              className="mt-6 w-full"
              disabled={code.length < 6 || isSubmitting}
              onClick={() => void handleEnable()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Verifying…
                </>
              ) : (
                "Enable and continue"
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Setup2faFallback() {
  return (
    <AppLoadingScreen
      title="Loading"
      message="Preparing two-factor setup…"
      subtitle="Admin"
    />
  )
}
