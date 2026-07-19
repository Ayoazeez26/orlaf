import { ClientOnly, createFileRoute, redirect } from "@tanstack/react-router"
import { z } from "zod"
import { SableBrandMark } from "@/components/sable-brand-mark"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { OnboardingProvider } from "@/features/onboarding/onboarding-context"
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow"

const onboardingSearchSchema = z.object({
  step: z.string().optional(),
  invite: z.string().optional(),
})

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  validateSearch: onboardingSearchSchema,
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()
    if (status === "loading" || status !== "authenticated" || !session) return

    if (session.needs_consent) return

    if (session.account_state === "pending_approval") {
      throw redirect({ to: "/dashboard" })
    }
    if (session.account_state === "active") {
      throw redirect({ to: "/dashboard" })
    }
    if (session.account_state === "suspended") {
      throw redirect({ to: "/auth/suspended" })
    }
    if (session.account_state === "rejected") {
      throw redirect({ to: "/auth/rejected" })
    }
  },
  component: OnboardingPage,
})

function OnboardingPage() {
  return (
    <ClientOnly fallback={<OnboardingFallback />}>
      <OnboardingProvider>
        <OnboardingFlow />
      </OnboardingProvider>
    </ClientOnly>
  )
}

function OnboardingFallback() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end sm:left-auto">
        <ThemeSwitcher compact />
      </div>
      <SableBrandMark className="mb-6" subtitle="Creators" />
      <div className="w-full max-w-lg animate-pulse rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto h-8 w-3/4 rounded-lg bg-muted" />
        <div className="mx-auto mt-3 h-4 w-1/2 rounded bg-muted" />
        <div className="mt-8 space-y-3">
          <div className="h-12 rounded-xl bg-muted" />
          <div className="h-12 rounded-xl bg-muted" />
          <div className="h-12 rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
