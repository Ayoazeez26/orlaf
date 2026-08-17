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

import { AdminRole } from "@sable/contracts"

export const TEAM_ROLE_OPTIONS = [
  {
    id: AdminRole.CONTENT_ADMIN,
    label: "Content admin",
    description: "Manage creators, projects, discovery, and reports.",
  },
  {
    id: AdminRole.SUPPORT_ADMIN,
    label: "Support admin",
    description: "Creators, onboarding, and moderation.",
  },
  {
    id: AdminRole.MARKETING_ADMIN,
    label: "Marketing admin",
    description: "Discovery rails and analytics.",
  },
  {
    id: AdminRole.FINANCE_ADMIN,
    label: "Finance admin",
    description: "Finance dashboards (when enabled).",
  },
] as const

export const TEAM_ROLE_BADGE_CLASS: Record<string, string> = {
  super_admin: "bg-primary/10 text-primary",
  content_admin: "bg-emerald-500/10 text-emerald-600",
  support_admin: "bg-amber-500/10 text-amber-600",
  marketing_admin: "bg-blue-500/10 text-blue-600",
  finance_admin: "bg-muted text-muted-foreground",
}

export const TEAM_ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  content_admin: "Content Admin",
  support_admin: "Support Admin",
  marketing_admin: "Marketing Admin",
  finance_admin: "Finance Admin",
}
