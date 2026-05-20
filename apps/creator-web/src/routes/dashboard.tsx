import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { useEffect, useState } from "react"
import { ONBOARDING_STORAGE_KEY } from "@/features/onboarding/constants"
import type { OnboardingData } from "@/features/onboarding/types"

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <ClientOnly fallback={<DashboardFallback />}>
      <DashboardContent />
    </ClientOnly>
  )
}

function DashboardFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f4f4f5] p-6">
      <div className="h-48 w-full max-w-2xl animate-pulse rounded-2xl bg-muted" />
    </div>
  )
}

function DashboardContent() {
  const [data, setData] = useState<OnboardingData | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (raw) {
      setData(JSON.parse(raw) as OnboardingData)
    }
  }, [])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#f4f4f5] p-6">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-bold text-2xl">Welcome to Creator Studio</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Onboarding complete. Your profile summary:
        </p>
        <pre className="mt-6 max-h-96 overflow-auto rounded-lg bg-muted p-4 text-xs">
          {data ? JSON.stringify(data, null, 2) : "No onboarding data found."}
        </pre>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/onboarding">Back to onboarding</Link>
        </Button>
      </div>
    </div>
  )
}
