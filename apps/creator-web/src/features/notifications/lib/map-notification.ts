import type { NotificationItem as ApiNotificationItem } from "@sable/contracts"
import { NotificationType } from "@sable/contracts"
import { formatRelativeUpdatedAt } from "@/features/projects/lib/format-relative-time"
import type { NotificationIcon, NotificationItem } from "../types"

function iconForType(type: ApiNotificationItem["type"]): NotificationIcon {
  switch (type) {
    case NotificationType.PAYOUT_PROCESSED:
    case NotificationType.COIN_PURCHASE:
      return "wallet"
    case NotificationType.EPISODE_PUBLISHED:
    case NotificationType.CREATOR_APPLICATION:
      return "shield"
    case NotificationType.GIFT_RECEIVED:
    case NotificationType.GIFT_SENT:
      return "users"
    case NotificationType.NEW_EPISODE:
      return "megaphone"
    default:
      return "bell"
  }
}

export function mapCreatorNotification(
  item: ApiNotificationItem
): NotificationItem {
  return {
    id: item.id,
    title: item.title,
    description: item.body,
    timestamp: formatRelativeUpdatedAt(new Date(item.created_at).getTime()),
    icon: iconForType(item.type),
    read: item.read_at !== null,
    href:
      typeof item.data?.href === "string" ? (item.data.href as string) : null,
  }
}

export function mapCreatorNotifications(
  items: ApiNotificationItem[]
): NotificationItem[] {
  return items.map(mapCreatorNotification)
}
