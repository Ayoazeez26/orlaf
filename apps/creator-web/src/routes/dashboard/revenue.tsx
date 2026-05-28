import { createFileRoute } from "@tanstack/react-router"
import { RevenueLayout } from "@/features/revenue/layouts/revenue-layout"

export const Route = createFileRoute("/dashboard/revenue")({
  component: RevenueLayoutRoute,
})

function RevenueLayoutRoute() {
  return <RevenueLayout />
}
