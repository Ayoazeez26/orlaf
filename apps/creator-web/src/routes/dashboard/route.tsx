import { createFileRoute } from "@tanstack/react-router"
import { DashboardLayout } from "@/features/dashboard/components/layout/dashboard-layout"

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  component: DashboardLayout,
})
