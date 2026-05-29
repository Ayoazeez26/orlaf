import { createFileRoute } from "@tanstack/react-router"
import { SettingsSecurityPage } from "@/features/settings/pages/settings-security-page"

export const Route = createFileRoute("/dashboard/settings/security")({
  component: SettingsSecurityPage,
})
