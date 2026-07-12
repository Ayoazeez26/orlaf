import type { LucideIcon } from "lucide-react"

export type NotificationCategory =
  | "moderation"
  | "promotions"
  | "payouts"
  | "creators"
  | "projects"
  | "system"

export type NotificationFilter = "all" | "unread" | NotificationCategory

export interface NotificationItem {
  id: string
  title: string
  body: string
  category: NotificationCategory
  timestamp: string
  isRead: boolean
  needsReview?: boolean
}

export interface NotificationSummaryStat {
  label: string
  value: number
  icon: LucideIcon
}
