import type { NotificationCategory, NotificationFilter } from "./types"

export const NOTIFICATION_FILTERS: {
  key: NotificationFilter
  label: string
}[] = [
  { key: "all", label: "All Notifications" },
  { key: "unread", label: "Unread" },
  { key: "moderation", label: "Moderation" },
  { key: "promotions", label: "Promotions" },
  { key: "payouts", label: "Payouts" },
  { key: "creators", label: "Creators" },
  { key: "projects", label: "Projects" },
  { key: "system", label: "System" },
]

export const NOTIFICATION_CATEGORY_LABEL: Record<NotificationCategory, string> =
  {
    moderation: "Moderation",
    promotions: "Promotions",
    payouts: "Payouts",
    creators: "Creators",
    projects: "Projects",
    system: "System",
  }
