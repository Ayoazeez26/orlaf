import { createFileRoute } from "@tanstack/react-router"
import { SettingsLayout } from "@/features/settings/layouts/settings-layout"

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsLayoutRoute,
})

function SettingsLayoutRoute() {
  return <SettingsLayout />
}
