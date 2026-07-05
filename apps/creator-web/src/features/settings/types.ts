import type {
  DashboardEarnMoreCard,
  DashboardWorkspace,
} from "@/features/dashboard/types"

export type SettingsTabId =
  | "profile"
  | "studio"
  | "team"
  | "notifications"
  | "security"
  | "preferences"
  | "earnings"
  | "archive"

export interface SocialLinkItem {
  platform: "Instagram" | "Twitter / X" | "YouTube" | "TikTok"
  url: string
}

export type TeamMemberRole = "Owner" | "Admin" | "Editor" | "Viewer"

export interface TeamMember {
  id: string
  name: string
  email: string
  initials: string
  role: TeamMemberRole
  pending?: boolean
}

export interface NotificationItem {
  id: string
  label: string
  description: string
  enabled: boolean
  icon?: "mail" | "phone" | "bell"
  disabled?: boolean
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
  browser: string
  lastActive: string
  current?: boolean
}

export interface SecurityMethod {
  id: string
  label: string
  description: string
  icon: "key" | "phone"
}

export interface PayoutMethod {
  id: string
  name: string
  details: string
  badges: Array<"PRIMARY" | "AFRICA" | "GLOBAL">
  isPrimary?: boolean
}

export interface ArchivedItem {
  id: string
  title: string
  type: "Project" | "Episode" | "Promotion"
  archivedAt: string
  size: string
  icon: "folder" | "film" | "megaphone"
}

export interface SettingsDashboardData {
  workspace: DashboardWorkspace
  profile: {
    initials: string
    firstName: string
    lastName: string
    username: string
    pronouns: string
    displayName: string
    bio: string
    email: string
    phone: string
    socialLinks: SocialLinkItem[]
  }
  studio: {
    name: string
    handle: string
    tagline: string
    website: string
    teamSize: string
    primaryGenre: string
    country: string
    description: string
    studioId: string
    tier: string
    teamMembers: TeamMember[]
  }
  notifications: NotificationGroup[]
  security: {
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
  earnings: {
    walletBalance: string
    pendingThisCycle: string
    nextPayout: string
    autoPayoutEnabled: boolean
    minimumThreshold: string
    payoutMethods: PayoutMethod[]
    taxResidency: string
    grossEarnings: string
    withholdingTax: string
    processingFee: string
    estimatedNet: string
  }
  archive: {
    items: ArchivedItem[]
  }
  earnMoreCards: DashboardEarnMoreCard[]
}
