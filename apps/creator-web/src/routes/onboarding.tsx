import { ClientOnly, createFileRoute } from "@tanstack/react-router"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { OnboardingProvider } from "@/features/onboarding/onboarding-context"
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow"

export const Route = createFileRoute("/onboarding")({
  ssr: false,
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
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>
      <p className="mb-6 font-semibold text-foreground text-lg">
        <span className="font-bold">OrlAf</span>{" "}
        <span className="text-muted-foreground">Creators</span>
      </p>
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
