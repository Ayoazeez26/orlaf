import { createFileRoute } from "@tanstack/react-router"
import { SettingsNotificationsPage } from "@/features/settings/pages/settings-notifications-page"

export const Route = createFileRoute("/dashboard/settings/notifications")({
  component: SettingsNotificationsPage,
})
