import { createFileRoute } from "@tanstack/react-router"
import { SettingsEarningsPage } from "@/features/settings/pages/settings-earnings-page"

export const Route = createFileRoute("/dashboard/settings/earnings")({
  component: SettingsEarningsPage,
})
