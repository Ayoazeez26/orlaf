import { createFileRoute, redirect } from "@tanstack/react-router"
import { getAuthSnapshot } from "@/features/auth/lib/auth-snapshot"
import { DashboardLayout } from "@/features/dashboard/components/layout/dashboard-layout"

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: () => {
    const { status } = getAuthSnapshot()
    if (status !== "authenticated") {
      throw redirect({ to: "/onboarding" })
    }
  },
  component: DashboardLayout,
})
