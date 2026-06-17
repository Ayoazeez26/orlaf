import { createFileRoute } from "@tanstack/react-router"
import { PromotionDetailPage } from "@/features/promotions/pages/promotion-detail-page"

export const Route = createFileRoute("/dashboard/promotions/$promotionId")({
  component: PromotionDetailPage,
})
