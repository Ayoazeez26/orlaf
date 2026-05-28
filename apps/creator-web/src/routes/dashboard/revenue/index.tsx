import { createFileRoute } from "@tanstack/react-router"
import { RevenueOverviewPage } from "@/features/revenue/pages/revenue-overview-page"

export const Route = createFileRoute("/dashboard/revenue/")({
  component: RevenueOverviewPage,
})
