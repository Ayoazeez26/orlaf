import type { CreatorNotificationSettings } from "@sable/contracts"

export const DEFAULT_CREATOR_NOTIFICATION_SETTINGS: CreatorNotificationSettings =
  {
    emailEnabled: true,
    pushEnabled: false,
    inAppEnabled: true,
    episodePublishedEnabled: true,
    newCommentsEnabled: true,
    contentFlaggedEnabled: true,
    payoutProcessedEnabled: true,
    coinPurchasesEnabled: false,
    revenueMilestoneEnabled: true,
    subscriberMilestoneEnabled: true,
    weeklyDigestEnabled: true,
    seriesTrendingEnabled: true,
    teamMemberJoinedEnabled: true,
    permissionChangedEnabled: true,
    updatedAt: new Date(0).toISOString(),
  }

export const NOTIFICATION_SETTINGS_DB_DEFAULTS = {
  notifyEmailEnabled: DEFAULT_CREATOR_NOTIFICATION_SETTINGS.emailEnabled,
  notifyPushEnabled: DEFAULT_CREATOR_NOTIFICATION_SETTINGS.pushEnabled,
  notifyInAppEnabled: DEFAULT_CREATOR_NOTIFICATION_SETTINGS.inAppEnabled,
  notifyEpisodePublished:
    DEFAULT_CREATOR_NOTIFICATION_SETTINGS.episodePublishedEnabled,
  notifyNewComments: DEFAULT_CREATOR_NOTIFICATION_SETTINGS.newCommentsEnabled,
  notifyContentFlagged:
    DEFAULT_CREATOR_NOTIFICATION_SETTINGS.contentFlaggedEnabled,
  notifyPayoutProcessed:
    DEFAULT_CREATOR_NOTIFICATION_SETTINGS.payoutProcessedEnabled,
  notifyCoinPurchases:
    DEFAULT_CREATOR_NOTIFICATION_SETTINGS.coinPurchasesEnabled,
  notifyRevenueMilestone:
    DEFAULT_CREATOR_NOTIFICATION_SETTINGS.revenueMilestoneEnabled,
  notifySubscriberMilestone:
    DEFAULT_CREATOR_NOTIFICATION_SETTINGS.subscriberMilestoneEnabled,
  notifyWeeklyDigest: DEFAULT_CREATOR_NOTIFICATION_SETTINGS.weeklyDigestEnabled,
  notifySeriesTrending:
    DEFAULT_CREATOR_NOTIFICATION_SETTINGS.seriesTrendingEnabled,
  notifyTeamMemberJoined:
    DEFAULT_CREATOR_NOTIFICATION_SETTINGS.teamMemberJoinedEnabled,
  notifyPermissionChanged:
    DEFAULT_CREATOR_NOTIFICATION_SETTINGS.permissionChangedEnabled,
} as const
