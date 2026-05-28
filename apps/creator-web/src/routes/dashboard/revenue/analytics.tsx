import { createFileRoute } from "@tanstack/react-router"
import { RevenueAnalyticsTabPage } from "@/features/revenue/pages/revenue-analytics-tab-page"

export const Route = createFileRoute("/dashboard/revenue/analytics")({
  component: RevenueAnalyticsTabPage,
})
