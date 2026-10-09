export type SettingsTabId =
  | "profile"
  | "studio"
  | "team"
  | "notifications"
  | "security"
  | "preferences"
  | "earnings"
  | "archive"

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
