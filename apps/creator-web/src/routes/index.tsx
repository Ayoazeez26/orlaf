import { createFileRoute, redirect } from "@tanstack/react-router"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { hasCompletedOnboarding } from "@/features/auth/lib/onboarding-complete"

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()
    if (status === "authenticated") {
      if (
        session?.account_state === "active" ||
        session?.account_state === "pending_approval" ||
        hasCompletedOnboarding()
      ) {
        throw redirect({ to: "/dashboard" })
      }
    }
    throw redirect({ to: "/onboarding" })
  },
})
