import { createFileRoute } from "@tanstack/react-router"
import { RevenueSettingsPage } from "@/features/revenue/pages/revenue-settings-page"

export const Route = createFileRoute("/dashboard/revenue/settings")({
  component: RevenueSettingsPage,
})
