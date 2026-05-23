import { createFileRoute } from "@tanstack/react-router"
import { DashboardStubPage } from "@/features/dashboard/components/dashboard-stub-page"

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardSettings,
})

function DashboardSettings() {
  return <DashboardStubPage title="Settings" />
}
