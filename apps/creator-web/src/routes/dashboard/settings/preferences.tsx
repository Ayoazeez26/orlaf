import { createFileRoute } from "@tanstack/react-router"
import { SettingsPreferencesPage } from "@/features/settings/pages/settings-preferences-page"

export const Route = createFileRoute("/dashboard/settings/preferences")({
  component: SettingsPreferencesPage,
})
