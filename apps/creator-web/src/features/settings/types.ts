import type {
  DashboardEarnMoreCard,
  DashboardWorkspace,
} from "@/features/dashboard/types"

export type SettingsTabId =
  | "profile"
  | "studio"
  | "notifications"
  | "security"
  | "preferences"

export interface SocialLinkItem {
  platform: "Instagram" | "Twitter / X" | "YouTube" | "TikTok"
  url: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  initials: string
  role: "Owner" | "Editor" | "Viewer"
}

export interface NotificationItem {
  id: string
  label: string
  description: string
  enabled: boolean
  icon?: "mail" | "phone" | "bell"
}

export interface NotificationGroup {
  id: string
  title: string
  description?: string
  items: NotificationItem[]
  icon?: "mail" | "phone" | "bell"
}

export interface SessionItem {
  id: string
  device: string
  location: string
  lastActive: string
  current?: boolean
}

export interface SecurityMethod {
  id: string
  label: string
  description: string
  icon: "key" | "phone"
}

export interface SettingsDashboardData {
  workspace: DashboardWorkspace
  profile: {
    initials: string
    firstName: string
    lastName: string
    displayName: string
    bio: string
    email: string
    phone: string
    socialLinks: SocialLinkItem[]
  }
  studio: {
    name: string
    handle: string
    description: string
    studioId: string
    tier: string
    teamMembers: TeamMember[]
  }
  notifications: NotificationGroup[]
  security: {
    password: {
      current: string
      next: string
      confirm: string
    }
    methods: SecurityMethod[]
    sessions: SessionItem[]
  }
  preferences: {
    defaultLanguage: string
    defaultVisibility: string
    commentsEnabledByDefault: boolean
    autoPublishAfterProcessing: boolean
    tippingEnabledByDefault: boolean
    dashboardLanguage: string
    timezone: string
    reducedMotion: boolean
  }
  earnMoreCards: DashboardEarnMoreCard[]
}
