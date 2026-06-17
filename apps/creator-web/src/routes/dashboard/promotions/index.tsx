import { createFileRoute } from "@tanstack/react-router"
import { PromotionsListPage } from "@/features/promotions/pages/promotions-list-page"

export const Route = createFileRoute("/dashboard/promotions/")({
  component: PromotionsListPage,
})
