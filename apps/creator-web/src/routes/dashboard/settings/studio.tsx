import { createFileRoute } from "@tanstack/react-router"
import { SettingsStudioPage } from "@/features/settings/pages/settings-studio-page"

export const Route = createFileRoute("/dashboard/settings/studio")({
  component: SettingsStudioPage,
})
