import { createFileRoute } from "@tanstack/react-router"
import { SettingsArchivePage } from "@/features/settings/pages/settings-archive-page"

export const Route = createFileRoute("/dashboard/settings/archive")({
  component: SettingsArchivePage,
})
