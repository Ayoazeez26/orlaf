import type { NotificationsData } from "../types"

export const MOCK_NOTIFICATIONS: NotificationsData = {
  items: [
    {
      id: "payout-sent",
      title: "Payout sent",
      description: "$840.00 was sent to your bank account.",
      timestamp: "2h ago",
      icon: "wallet",
      read: false,
    },
    {
      id: "episode-approved",
      title: "Episode approved",
      description: "'Lagos After Dark — Ep. 04' is now live.",
      timestamp: "5h ago",
      icon: "shield",
      read: false,
    },
    {
      id: "new-subscribers",
      title: "New subscribers",
      description: "You gained 124 new subscribers today.",
      timestamp: "Yesterday",
      icon: "users",
      read: false,
    },
    {
      id: "promotion-update",
      title: "Promotion update",
      description: "'Premiere Boost' reached 12k impressions.",
      timestamp: "2d ago",
      icon: "megaphone",
      read: true,
    },
    {
      id: "reminder",
      title: "Reminder",
      description: "Schedule your next episode to keep momentum.",
      timestamp: "3d ago",
      icon: "bell",
      read: true,
    },
  ],
}
