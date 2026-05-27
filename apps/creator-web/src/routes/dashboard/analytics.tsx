import { createFileRoute } from "@tanstack/react-router"
import { AnalyticsDashboardPage } from "@/features/analytics/pages/analytics-dashboard-page"

export const Route = createFileRoute("/dashboard/analytics")({
  component: DashboardAnalytics,
})

function DashboardAnalytics() {
  return <AnalyticsDashboardPage />
}
