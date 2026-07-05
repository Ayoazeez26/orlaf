import { createFileRoute } from "@tanstack/react-router"
import { SettingsTeamPage } from "@/features/settings/pages/settings-team-page"

export const Route = createFileRoute("/dashboard/settings/team")({
  component: SettingsTeamPage,
})
