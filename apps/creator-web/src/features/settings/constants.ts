import {
  Archive,
  Bell,
  Clapperboard,
  Globe,
  Shield,
  User,
  Users,
  Wallet,
} from "lucide-react"
import type { SettingsTabId } from "./types"

export const SETTINGS_TABS: Array<{
  id: SettingsTabId
  label: string
  path: string
  icon: typeof User
}> = [
  { id: "profile", label: "Profile", path: "", icon: User },
  { id: "studio", label: "Studio", path: "studio", icon: Clapperboard },
  { id: "team", label: "Team", path: "team", icon: Users },
  { id: "preferences", label: "Preferences", path: "preferences", icon: Globe },
  {
    id: "notifications",
    label: "Notifications",
    path: "notifications",
    icon: Bell,
  },
  { id: "earnings", label: "Earnings", path: "earnings", icon: Wallet },
  { id: "security", label: "Security", path: "security", icon: Shield },
  { id: "archive", label: "Archive", path: "archive", icon: Archive },
]

export const LANGUAGE_OPTIONS = ["English", "French", "Spanish"] as const

export const VISIBILITY_OPTIONS = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Unlisted", value: "unlisted" },
] as const

export const TIMEZONE_OPTIONS = [
  { label: "West Africa Time (WAT)", value: "Africa/Lagos" },
  { label: "Greenwich Mean Time (GMT)", value: "Europe/London" },
  { label: "Eastern Time (ET)", value: "America/New_York" },
] as const
export const PRONOUNS_OPTIONS = [
  "She / her",
  "He / him",
  "They / them",
  "Prefer not to say",
] as const
export const TEAM_SIZE_OPTIONS = [
  "1-5 people",
  "6-15 people",
  "16-50 people",
  "50+ people",
] as const
export const GENRE_OPTIONS = [
  "Drama",
  "Comedy",
  "Romance",
  "Documentary",
  "Thriller",
] as const
export const COUNTRY_OPTIONS = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
] as const
export const PAYOUT_THRESHOLD_OPTIONS = [
  "₦ 5,000",
  "₦ 10,000",
  "₦ 25,000",
  "₦ 50,000",
] as const

export function settingsTabPath(path: string) {
  if (path === "") {
    return { to: "/dashboard/settings" as const }
  }
  return { to: `/dashboard/settings/${path}` as const }
}
