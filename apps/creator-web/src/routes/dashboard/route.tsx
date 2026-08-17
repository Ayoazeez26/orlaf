import { createFileRoute, redirect } from "@tanstack/react-router"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { DashboardLayout } from "@/features/dashboard/components/layout/dashboard-layout"

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()
    if (status === "loading") return
    if (status !== "authenticated") {
      throw redirect({ to: "/login" })
    }
    if (session?.account_state === "suspended") {
      throw redirect({ to: "/auth/suspended" })
    }
    if (session?.account_state === "rejected") {
      throw redirect({ to: "/auth/rejected" })
    }
  },
  component: DashboardLayout,
})
