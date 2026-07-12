import type { LucideIcon } from "lucide-react"
import {
  Bell,
  Coins,
  CreditCard,
  Palette,
  Settings2,
  Shield,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react"

export type SettingsTabId =
  | "general"
  | "branding"
  | "creators"
  | "moderation"
  | "discovery"
  | "coin-economy"
  | "payouts"
  | "subscriptions"
  | "notifications"
  | "security"
  | "team"

export interface SettingsTabDef {
  id: SettingsTabId
  label: string
  icon: LucideIcon
}

export const SETTINGS_TABS: SettingsTabDef[] = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "creators", label: "Creators", icon: UserPlus },
  { id: "moderation", label: "Moderation", icon: ShieldCheck },
  { id: "discovery", label: "Discovery", icon: Sparkles },
  { id: "coin-economy", label: "Coin economy", icon: Coins },
  { id: "payouts", label: "Payouts", icon: Wallet },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "team", label: "Team", icon: Users },
]

export const SIGNUP_MODE_OPTIONS = [
  "Invite only",
  "Open applications",
  "Closed",
] as const

export const REVIEW_MODE_OPTIONS = [
  "Manual review before publish",
  "Auto-publish with spot checks",
  "Auto-publish",
] as const

export const SUSPENSION_LENGTH_OPTIONS = [
  "7 days",
  "14 days",
  "30 days",
  "Permanent",
] as const

export const HERO_ROTATION_OPTIONS = [
  "Every 12 hours",
  "Every 24 hours",
  "Every 48 hours",
  "Weekly",
] as const

export const REGION_OPTIONS = [
  "Nigeria (NGN)",
  "Ghana (GHS)",
  "Kenya (KES)",
] as const

export const LANGUAGE_OPTIONS = [
  "English",
  "French",
  "Hausa",
  "Yoruba",
] as const

export const SESSION_TIMEOUT_OPTIONS = [
  "30 minutes",
  "1 hour",
  "4 hours",
  "8 hours",
] as const

export const AUDIT_RETENTION_OPTIONS = [
  "30 days",
  "60 days",
  "90 days",
  "1 year",
] as const

export const TEAM_ROLE_OPTIONS = [
  {
    id: "admin",
    label: "Admin",
    description: "Full access to every setting & action.",
  },
  {
    id: "moderator",
    label: "Moderator",
    description: "Manage content, creators & reports.",
  },
  {
    id: "finance-admin",
    label: "Finance Admin",
    description: "Role based access to Finance Dashboard.",
  },
  {
    id: "analyst",
    label: "Analyst",
    description: "Read-only access to analytics and reports.",
  },
] as const

export const TEAM_ROLE_BADGE_CLASS: Record<string, string> = {
  "super-admin": "bg-primary/10 text-primary",
  admin: "bg-emerald-500/10 text-emerald-600",
  moderator: "bg-amber-500/10 text-amber-600",
  analyst: "bg-muted text-muted-foreground",
  "finance-admin": "bg-blue-500/10 text-blue-600",
}

export const TEAM_ROLE_LABEL: Record<string, string> = {
  "super-admin": "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
  analyst: "Analyst",
  "finance-admin": "Finance Admin",
}
