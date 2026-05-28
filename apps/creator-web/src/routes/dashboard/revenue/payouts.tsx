import { createFileRoute } from "@tanstack/react-router"
import { RevenuePayoutsPage } from "@/features/revenue/pages/revenue-payouts-page"

export const Route = createFileRoute("/dashboard/revenue/payouts")({
  component: RevenuePayoutsPage,
})
