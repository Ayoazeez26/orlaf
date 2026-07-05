import type {
  CreatorNotificationSettings,
  UpdateCreatorNotificationSettingsRequest,
} from "@sable/contracts"
import type { NotificationGroup } from "../types"

export const PUSH_NOTIFICATIONS_AVAILABLE = false

type SettingsKey = keyof Omit<CreatorNotificationSettings, "updatedAt">

const ITEM_FIELD_MAP = {
  email: "emailEnabled",
  push: "pushEnabled",
  "in-app": "inAppEnabled",
  "episode-published": "episodePublishedEnabled",
  "new-comments": "newCommentsEnabled",
  flagged: "contentFlaggedEnabled",
  "payout-processed": "payoutProcessedEnabled",
  "coin-purchases": "coinPurchasesEnabled",
  milestone: "revenueMilestoneEnabled",
  "subscriber-milestone": "subscriberMilestoneEnabled",
  "weekly-digest": "weeklyDigestEnabled",
  trending: "seriesTrendingEnabled",
  "team-joined": "teamMemberJoinedEnabled",
  "permission-changed": "permissionChangedEnabled",
} as const satisfies Record<string, SettingsKey>

export type NotificationItemId = keyof typeof ITEM_FIELD_MAP

export const NOTIFICATION_SETTINGS_GROUPS: Array<
  Omit<NotificationGroup, "items"> & {
    studioOnly?: boolean
    items: Array<{
      id: NotificationItemId
      label: string
      description: string
      icon?: "mail" | "phone" | "bell"
      disabled?: boolean
    }>
  }
> = [
  {
    id: "channels",
    title: "Notification Channels",
    description: "Choose how you receive notifications",
    icon: "mail",
    items: [
      {
        id: "email",
        label: "Email Notifications",
        description: "Receive updates via email",
        icon: "mail",
      },
      {
        id: "push",
        label: "Push Notifications",
        description: PUSH_NOTIFICATIONS_AVAILABLE
          ? "Browser and mobile push alerts"
          : "Coming soon — browser and mobile push alerts",
        icon: "phone",
        disabled: !PUSH_NOTIFICATIONS_AVAILABLE,
      },
      {
        id: "in-app",
        label: "In-App Notifications",
        description: "Notifications inside Sable TV dashboard",
        icon: "bell",
      },
    ],
  },
  {
    id: "content",
    title: "Content & Publishing",
    items: [
      {
        id: "episode-published",
        label: "Episode published successfully",
        description: "Get notified when your upload finishes processing",
      },
      {
        id: "new-comments",
        label: "New comments on your series",
        description: "When viewers leave comments on your episodes",
      },
      {
        id: "flagged",
        label: "Content flagged for review",
        description: "If any of your content is flagged by the community",
      },
    ],
  },
  {
    id: "revenue",
    title: "Revenue & Payouts",
    items: [
      {
        id: "payout-processed",
        label: "Payout processed",
        description: "When your scheduled payout has been sent",
      },
      {
        id: "coin-purchases",
        label: "New coin purchases",
        description: "When viewers buy coins on your gated content",
      },
      {
        id: "milestone",
        label: "Revenue milestone reached",
        description: "Celebrate when you hit earning milestones",
      },
    ],
  },
  {
    id: "audience",
    title: "Audience & Growth",
    items: [
      {
        id: "subscriber-milestone",
        label: "New subscriber milestone",
        description: "Get notified at 100, 1K, 10K, 100K subscribers",
      },
      {
        id: "weekly-digest",
        label: "Weekly analytics digest",
        description: "A summary of your performance every Monday",
      },
      {
        id: "trending",
        label: "Series trending notification",
        description: "When your series appears in trending",
      },
    ],
  },
  {
    id: "team",
    title: "Team & Studio",
    studioOnly: true,
    items: [
      {
        id: "team-joined",
        label: "New team member joined",
        description: "When someone accepts your studio invite",
      },
      {
        id: "permission-changed",
        label: "Permission changes",
        description: "When your role or access level is updated",
      },
    ],
  },
]

export function notificationSettingsToGroups(
  settings: CreatorNotificationSettings,
  isStudioCreator: boolean
): NotificationGroup[] {
  return NOTIFICATION_SETTINGS_GROUPS.filter(
    (group) => !group.studioOnly || isStudioCreator
  ).map((group) => ({
    id: group.id,
    title: group.title,
    description: group.description,
    icon: group.icon,
    items: group.items.map((item) => ({
      id: item.id,
      label: item.label,
      description: item.description,
      icon: item.icon,
      enabled: settings[ITEM_FIELD_MAP[item.id]],
      disabled: item.disabled,
    })),
  }))
}

export function groupsToNotificationSettingsPatch(
  groups: NotificationGroup[],
  isStudioCreator: boolean
): UpdateCreatorNotificationSettingsRequest {
  const patch: UpdateCreatorNotificationSettingsRequest = {}

  for (const group of groups) {
    const definition = NOTIFICATION_SETTINGS_GROUPS.find(
      (candidate) => candidate.id === group.id
    )
    if (definition?.studioOnly && !isStudioCreator) continue

    for (const item of group.items) {
      const field = ITEM_FIELD_MAP[item.id as NotificationItemId]
      if (!field || field === "pushEnabled") continue
      patch[field] = item.enabled
    }
  }

  return patch
}
