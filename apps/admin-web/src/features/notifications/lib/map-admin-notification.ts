import type {
  AdminNotificationCategory,
  NotificationItem as ApiNotificationItem,
} from "@sable/contracts"
import { NotificationType } from "@sable/contracts"
import { formatRelative } from "@/features/onboarding/data/map-onboarding"
import type { NotificationCategory, NotificationItem } from "../types"

function categoryFromType(
  type: ApiNotificationItem["type"]
): NotificationCategory {
  switch (type) {
    case NotificationType.CREATOR_APPLICATION:
      return "creators"
    case NotificationType.CONTENT_FLAGGED:
      return "moderation"
    case NotificationType.PAYOUT_PROCESSED:
      return "payouts"
    case NotificationType.EPISODE_PUBLISHED:
      return "projects"
    case NotificationType.SYSTEM_ALERT:
      return "system"
    default:
      return "system"
  }
}

function resolveCategory(item: ApiNotificationItem): NotificationCategory {
  const fromData = item.data?.category
  if (
    typeof fromData === "string" &&
    [
      "moderation",
      "promotions",
      "payouts",
      "creators",
      "projects",
      "system",
    ].includes(fromData)
  ) {
    return fromData as AdminNotificationCategory
  }
  return categoryFromType(item.type)
}

export function mapAdminNotification(
  item: ApiNotificationItem
): NotificationItem {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    category: resolveCategory(item),
    timestamp: formatRelative(item.created_at),
    isRead: item.read_at !== null,
    needsReview: item.data?.needs_review === true,
    href: typeof item.data?.href === "string" ? item.data.href : null,
  }
}

export function mapAdminNotifications(
  items: ApiNotificationItem[]
): NotificationItem[] {
  return items.map(mapAdminNotification)
}
