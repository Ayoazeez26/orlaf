import { createFileRoute, redirect } from "@tanstack/react-router"
import { getAuthSnapshot } from "@/features/auth/lib/auth-snapshot"
import { hasCompletedOnboarding } from "@/features/auth/lib/onboarding-complete"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { status } = getAuthSnapshot()
    if (status === "authenticated" && hasCompletedOnboarding()) {
      throw redirect({ to: "/dashboard" })
    }
    throw redirect({ to: "/onboarding" })
  },
})
