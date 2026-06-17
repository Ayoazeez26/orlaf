import { createFileRoute } from "@tanstack/react-router"
import { SupportPage } from "@/features/support/pages/support-page"

export const Route = createFileRoute("/dashboard/support")({
  component: SupportPage,
})
