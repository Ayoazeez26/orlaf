import { createFileRoute } from "@tanstack/react-router"
import { SettingsIndexPage } from "@/features/settings/pages/settings-index-page"

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsIndexPage,
})
