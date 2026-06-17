import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/promotions")({
  component: PromotionsLayout,
})

function PromotionsLayout() {
  return <Outlet />
}
