import { createFileRoute, redirect } from "@tanstack/react-router"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { DashboardLayout } from "@/features/dashboard/components/layout/dashboard-layout"

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: async () => {
    const { status } = await getAuthReady()
    if (status === "loading") return
    if (status !== "authenticated") {
      throw redirect({ to: "/onboarding" })
    }
  },
  component: DashboardLayout,
})
