export type NotificationIcon =
  | "wallet"
  | "shield"
  | "users"
  | "megaphone"
  | "bell"

export interface NotificationItem {
  id: string
  title: string
  description: string
  timestamp: string
  icon: NotificationIcon
  read: boolean
}

export interface NotificationsData {
  items: NotificationItem[]
}
