import type { CreatorNotificationSettings } from "@sable/contracts"
import type { CreatorProfile } from "../generated/prisma/client"
import { DEFAULT_CREATOR_NOTIFICATION_SETTINGS } from "./notification-settings.constants"

type NotificationSettingsProfile = Pick<
  CreatorProfile,
  | "notifyEmailEnabled"
  | "notifyPushEnabled"
  | "notifyInAppEnabled"
  | "notifyEpisodePublished"
  | "notifyNewComments"
  | "notifyContentFlagged"
  | "notifyPayoutProcessed"
  | "notifyCoinPurchases"
  | "notifyRevenueMilestone"
  | "notifySubscriberMilestone"
  | "notifyWeeklyDigest"
  | "notifySeriesTrending"
  | "notifyTeamMemberJoined"
  | "notifyPermissionChanged"
  | "updatedAt"
>

export function mapCreatorNotificationSettings(
  profile: NotificationSettingsProfile | null
): CreatorNotificationSettings {
  if (!profile) {
    return { ...DEFAULT_CREATOR_NOTIFICATION_SETTINGS }
  }

  return {
    emailEnabled: profile.notifyEmailEnabled,
    pushEnabled: profile.notifyPushEnabled,
    inAppEnabled: profile.notifyInAppEnabled,
    episodePublishedEnabled: profile.notifyEpisodePublished,
    newCommentsEnabled: profile.notifyNewComments,
    contentFlaggedEnabled: profile.notifyContentFlagged,
    payoutProcessedEnabled: profile.notifyPayoutProcessed,
    coinPurchasesEnabled: profile.notifyCoinPurchases,
    revenueMilestoneEnabled: profile.notifyRevenueMilestone,
    subscriberMilestoneEnabled: profile.notifySubscriberMilestone,
    weeklyDigestEnabled: profile.notifyWeeklyDigest,
    seriesTrendingEnabled: profile.notifySeriesTrending,
    teamMemberJoinedEnabled: profile.notifyTeamMemberJoined,
    permissionChangedEnabled: profile.notifyPermissionChanged,
    updatedAt: profile.updatedAt.toISOString(),
  }
}
