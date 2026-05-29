import { Bell, Building2, CircleHelp, Shield, User } from "lucide-react"
import type { SettingsTabId } from "./types"

export const SETTINGS_TABS: Array<{
  id: SettingsTabId
  label: string
  path: string
  icon: typeof User
}> = [
  { id: "profile", label: "Profile", path: "", icon: User },
  { id: "studio", label: "Studio", path: "studio", icon: Building2 },
  {
    id: "notifications",
    label: "Notifications",
    path: "notifications",
    icon: Bell,
  },
  { id: "security", label: "Security", path: "security", icon: Shield },
  {
    id: "preferences",
    label: "Preferences",
    path: "preferences",
    icon: CircleHelp,
  },
]

export const LANGUAGE_OPTIONS = ["English", "French", "Spanish"] as const
export const VISIBILITY_OPTIONS = ["Public", "Private", "Unlisted"] as const
export const TIMEZONE_OPTIONS = [
  "West Africa Time (WAT)",
  "Greenwich Mean Time (GMT)",
  "Eastern Time (ET)",
] as const

export function settingsTabPath(path: string) {
  if (path === "") {
    return { to: "/dashboard/settings" as const }
  }
  return { to: `/dashboard/settings/${path}` as const }
}
