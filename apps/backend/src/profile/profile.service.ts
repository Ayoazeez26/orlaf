import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import type { CreatorPreferences } from "@sable/contracts"
import { IVideoHostingProvider, VIDEO_HOSTING_PROVIDER } from "@sable/contracts"
import { CustomLogger } from "@sable/logger"
import { PrismaService } from "../prisma/prisma.service"
import { UpdateNotificationSettingsDto } from "./dto/notification-settings.dto"
import { UpdatePreferencesDto } from "./dto/preferences.dto"
import {
  GetAvatarUploadUrlDto,
  UpdateProfileDto,
  UpdateSocialLinksDto,
  UpdateStudioDto,
} from "./dto/profile.dto"
import {
  DEFAULT_CREATOR_NOTIFICATION_SETTINGS,
  NOTIFICATION_SETTINGS_DB_DEFAULTS,
} from "./notification-settings.constants"
import { mapCreatorNotificationSettings } from "./notification-settings.mapper"
import { DEFAULT_CREATOR_PREFERENCES } from "./preferences.constants"
import { mapCreatorPreferences } from "./preferences.mapper"

@Injectable()
export class ProfileService {
  private readonly logger = new CustomLogger(ProfileService.name)

  constructor(
    private readonly prisma: PrismaService,
    @Inject(VIDEO_HOSTING_PROVIDER)
    private readonly videoHosting: IVideoHostingProvider
  ) {}

  // ---------------------------------------------------------------------------
  // Get full profile
  // ---------------------------------------------------------------------------

  async getProfile(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        email: true,
        displayName: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        bio: true,
        phone: true,
        instagramUrl: true,
        twitterUrl: true,
        youtubeUrl: true,
        tiktokUrl: true,
        accountType: true,
        status: true,
        createdAt: true,
        creatorProfile: true,
      },
    })

    if (!account) throw new NotFoundException("Account not found")
    return account
  }

  // ---------------------------------------------------------------------------
  // Update personal profile
  // ---------------------------------------------------------------------------

  async updateProfile(accountId: string, dto: UpdateProfileDto) {
    const account = await this.prisma.account.update({
      where: { id: accountId },
      data: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.displayName !== undefined && { displayName: dto.displayName }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.avatarUrl !== undefined && {
          avatarUrl: dto.avatarUrl || null,
        }),
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        bio: true,
        phone: true,
      },
    })

    this.logger.log({ event: "profile_updated", account_id: accountId })
    return account
  }

  // ---------------------------------------------------------------------------
  // Update social links
  // ---------------------------------------------------------------------------

  async updateSocialLinks(accountId: string, dto: UpdateSocialLinksDto) {
    const account = await this.prisma.account.update({
      where: { id: accountId },
      data: {
        ...(dto.instagramUrl !== undefined && {
          instagramUrl: dto.instagramUrl,
        }),
        ...(dto.twitterUrl !== undefined && { twitterUrl: dto.twitterUrl }),
        ...(dto.youtubeUrl !== undefined && { youtubeUrl: dto.youtubeUrl }),
        ...(dto.tiktokUrl !== undefined && { tiktokUrl: dto.tiktokUrl }),
      },
      select: {
        instagramUrl: true,
        twitterUrl: true,
        youtubeUrl: true,
        tiktokUrl: true,
      },
    })

    this.logger.log({ event: "social_links_updated", account_id: accountId })
    return account
  }

  // ---------------------------------------------------------------------------
  // Update studio profile (creator only)
  // ---------------------------------------------------------------------------

  async updateStudio(accountId: string, dto: UpdateStudioDto) {
    // Check handle uniqueness if changing it
    if (dto.handle) {
      const existing = await this.prisma.creatorProfile.findFirst({
        where: {
          handle: dto.handle,
          NOT: { accountId },
        },
      })
      if (existing) {
        throw new ConflictException("Handle is already taken")
      }
    }

    const profile = await this.prisma.creatorProfile.upsert({
      where: { accountId },
      create: {
        accountId,
        studioName: dto.studioName,
        handle: dto.handle,
        description: dto.description,
        logoUrl: dto.logoUrl,
      },
      update: {
        ...(dto.studioName !== undefined && { studioName: dto.studioName }),
        ...(dto.handle !== undefined && { handle: dto.handle }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
      },
    })

    this.logger.log({ event: "studio_updated", account_id: accountId })
    return profile
  }

  // ---------------------------------------------------------------------------
  // Avatar upload URL
  // ---------------------------------------------------------------------------

  async getAvatarUploadUrl(accountId: string, dto: GetAvatarUploadUrlDto) {
    const contentType = dto.contentType ?? "image/jpeg"

    this.logger.log({
      event: "avatar_upload_url_requested",
      account_id: accountId,
    })

    return this.videoHosting.createImageUploadUrl({
      creatorId: accountId,
      contentType,
    })
  }

  // ---------------------------------------------------------------------------
  // Studio logo upload URL
  // ---------------------------------------------------------------------------

  async getLogoUploadUrl(accountId: string, dto: GetAvatarUploadUrlDto) {
    const contentType = dto.contentType ?? "image/jpeg"

    this.logger.log({
      event: "logo_upload_url_requested",
      account_id: accountId,
    })

    return this.videoHosting.createImageUploadUrl({
      creatorId: accountId,
      contentType,
    })
  }

  // ---------------------------------------------------------------------------
  // Creator preferences
  // ---------------------------------------------------------------------------

  private preferencesSelect = {
    defaultContentLanguage: true,
    defaultVisibility: true,
    commentsEnabledByDefault: true,
    autoPublishAfterProcessing: true,
    tippingEnabledByDefault: true,
    dashboardLanguage: true,
    timezone: true,
    colorScheme: true,
    reducedMotion: true,
    updatedAt: true,
  } as const

  async getPreferences(accountId: string) {
    const profile = await this.prisma.creatorProfile.upsert({
      where: { accountId },
      create: {
        accountId,
        defaultContentLanguage:
          DEFAULT_CREATOR_PREFERENCES.defaultContentLanguage,
        defaultVisibility: DEFAULT_CREATOR_PREFERENCES.defaultVisibility,
        commentsEnabledByDefault:
          DEFAULT_CREATOR_PREFERENCES.commentsEnabledByDefault,
        autoPublishAfterProcessing:
          DEFAULT_CREATOR_PREFERENCES.autoPublishAfterProcessing,
        tippingEnabledByDefault:
          DEFAULT_CREATOR_PREFERENCES.tippingEnabledByDefault,
        dashboardLanguage: DEFAULT_CREATOR_PREFERENCES.dashboardLanguage,
        timezone: DEFAULT_CREATOR_PREFERENCES.timezone,
        colorScheme: DEFAULT_CREATOR_PREFERENCES.colorScheme,
        reducedMotion: DEFAULT_CREATOR_PREFERENCES.reducedMotion,
      },
      update: {},
      select: this.preferencesSelect,
    })

    return mapCreatorPreferences(profile)
  }

  async updatePreferences(accountId: string, dto: UpdatePreferencesDto) {
    const profile = await this.prisma.creatorProfile.upsert({
      where: { accountId },
      create: {
        accountId,
        defaultContentLanguage:
          dto.defaultContentLanguage ??
          DEFAULT_CREATOR_PREFERENCES.defaultContentLanguage,
        defaultVisibility:
          dto.defaultVisibility ??
          DEFAULT_CREATOR_PREFERENCES.defaultVisibility,
        commentsEnabledByDefault:
          dto.commentsEnabledByDefault ??
          DEFAULT_CREATOR_PREFERENCES.commentsEnabledByDefault,
        autoPublishAfterProcessing:
          dto.autoPublishAfterProcessing ??
          DEFAULT_CREATOR_PREFERENCES.autoPublishAfterProcessing,
        tippingEnabledByDefault:
          dto.tippingEnabledByDefault ??
          DEFAULT_CREATOR_PREFERENCES.tippingEnabledByDefault,
        dashboardLanguage:
          dto.dashboardLanguage ??
          DEFAULT_CREATOR_PREFERENCES.dashboardLanguage,
        timezone: dto.timezone ?? DEFAULT_CREATOR_PREFERENCES.timezone,
        colorScheme: dto.colorScheme ?? DEFAULT_CREATOR_PREFERENCES.colorScheme,
        reducedMotion:
          dto.reducedMotion ?? DEFAULT_CREATOR_PREFERENCES.reducedMotion,
      },
      update: {
        ...(dto.defaultContentLanguage !== undefined && {
          defaultContentLanguage: dto.defaultContentLanguage,
        }),
        ...(dto.defaultVisibility !== undefined && {
          defaultVisibility: dto.defaultVisibility,
        }),
        ...(dto.commentsEnabledByDefault !== undefined && {
          commentsEnabledByDefault: dto.commentsEnabledByDefault,
        }),
        ...(dto.autoPublishAfterProcessing !== undefined && {
          autoPublishAfterProcessing: dto.autoPublishAfterProcessing,
        }),
        ...(dto.tippingEnabledByDefault !== undefined && {
          tippingEnabledByDefault: dto.tippingEnabledByDefault,
        }),
        ...(dto.dashboardLanguage !== undefined && {
          dashboardLanguage: dto.dashboardLanguage,
        }),
        ...(dto.timezone !== undefined && { timezone: dto.timezone }),
        ...(dto.colorScheme !== undefined && {
          colorScheme: dto.colorScheme,
        }),
        ...(dto.reducedMotion !== undefined && {
          reducedMotion: dto.reducedMotion,
        }),
      },
      select: this.preferencesSelect,
    })

    this.logger.log({
      event: "creator_preferences_updated",
      account_id: accountId,
    })
    return mapCreatorPreferences(profile)
  }

  async getContentDefaultsForSeries(creatorId: string) {
    const profile = await this.prisma.creatorProfile.findUnique({
      where: { accountId: creatorId },
      select: {
        defaultContentLanguage: true,
        defaultVisibility: true,
        commentsEnabledByDefault: true,
        tippingEnabledByDefault: true,
        autoPublishAfterProcessing: true,
      },
    })

    return {
      defaultContentLanguage:
        profile?.defaultContentLanguage ??
        DEFAULT_CREATOR_PREFERENCES.defaultContentLanguage,
      defaultVisibility:
        (profile?.defaultVisibility as CreatorPreferences["defaultVisibility"]) ??
        DEFAULT_CREATOR_PREFERENCES.defaultVisibility,
      commentsEnabledByDefault:
        profile?.commentsEnabledByDefault ??
        DEFAULT_CREATOR_PREFERENCES.commentsEnabledByDefault,
      tippingEnabledByDefault:
        profile?.tippingEnabledByDefault ??
        DEFAULT_CREATOR_PREFERENCES.tippingEnabledByDefault,
      autoPublishAfterProcessing:
        profile?.autoPublishAfterProcessing ??
        DEFAULT_CREATOR_PREFERENCES.autoPublishAfterProcessing,
    }
  }

  // ---------------------------------------------------------------------------
  // Notification settings
  // ---------------------------------------------------------------------------

  private notificationSettingsSelect = {
    notifyEmailEnabled: true,
    notifyPushEnabled: true,
    notifyInAppEnabled: true,
    notifyEpisodePublished: true,
    notifyNewComments: true,
    notifyContentFlagged: true,
    notifyPayoutProcessed: true,
    notifyCoinPurchases: true,
    notifyRevenueMilestone: true,
    notifySubscriberMilestone: true,
    notifyWeeklyDigest: true,
    notifySeriesTrending: true,
    notifyTeamMemberJoined: true,
    notifyPermissionChanged: true,
    updatedAt: true,
  } as const

  async getNotificationSettings(accountId: string) {
    const profile = await this.prisma.creatorProfile.upsert({
      where: { accountId },
      create: {
        accountId,
        ...NOTIFICATION_SETTINGS_DB_DEFAULTS,
      },
      update: {},
      select: this.notificationSettingsSelect,
    })

    return mapCreatorNotificationSettings(profile)
  }

  async updateNotificationSettings(
    accountId: string,
    dto: UpdateNotificationSettingsDto
  ) {
    if (dto.pushEnabled === true) {
      throw new BadRequestException("Push notifications are not available yet")
    }

    const profile = await this.prisma.creatorProfile.upsert({
      where: { accountId },
      create: {
        accountId,
        notifyEmailEnabled:
          dto.emailEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.emailEnabled,
        notifyPushEnabled:
          dto.pushEnabled ?? DEFAULT_CREATOR_NOTIFICATION_SETTINGS.pushEnabled,
        notifyInAppEnabled:
          dto.inAppEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.inAppEnabled,
        notifyEpisodePublished:
          dto.episodePublishedEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.episodePublishedEnabled,
        notifyNewComments:
          dto.newCommentsEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.newCommentsEnabled,
        notifyContentFlagged:
          dto.contentFlaggedEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.contentFlaggedEnabled,
        notifyPayoutProcessed:
          dto.payoutProcessedEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.payoutProcessedEnabled,
        notifyCoinPurchases:
          dto.coinPurchasesEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.coinPurchasesEnabled,
        notifyRevenueMilestone:
          dto.revenueMilestoneEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.revenueMilestoneEnabled,
        notifySubscriberMilestone:
          dto.subscriberMilestoneEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.subscriberMilestoneEnabled,
        notifyWeeklyDigest:
          dto.weeklyDigestEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.weeklyDigestEnabled,
        notifySeriesTrending:
          dto.seriesTrendingEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.seriesTrendingEnabled,
        notifyTeamMemberJoined:
          dto.teamMemberJoinedEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.teamMemberJoinedEnabled,
        notifyPermissionChanged:
          dto.permissionChangedEnabled ??
          DEFAULT_CREATOR_NOTIFICATION_SETTINGS.permissionChangedEnabled,
      },
      update: {
        ...(dto.emailEnabled !== undefined && {
          notifyEmailEnabled: dto.emailEnabled,
        }),
        ...(dto.pushEnabled !== undefined && {
          notifyPushEnabled: dto.pushEnabled,
        }),
        ...(dto.inAppEnabled !== undefined && {
          notifyInAppEnabled: dto.inAppEnabled,
        }),
        ...(dto.episodePublishedEnabled !== undefined && {
          notifyEpisodePublished: dto.episodePublishedEnabled,
        }),
        ...(dto.newCommentsEnabled !== undefined && {
          notifyNewComments: dto.newCommentsEnabled,
        }),
        ...(dto.contentFlaggedEnabled !== undefined && {
          notifyContentFlagged: dto.contentFlaggedEnabled,
        }),
        ...(dto.payoutProcessedEnabled !== undefined && {
          notifyPayoutProcessed: dto.payoutProcessedEnabled,
        }),
        ...(dto.coinPurchasesEnabled !== undefined && {
          notifyCoinPurchases: dto.coinPurchasesEnabled,
        }),
        ...(dto.revenueMilestoneEnabled !== undefined && {
          notifyRevenueMilestone: dto.revenueMilestoneEnabled,
        }),
        ...(dto.subscriberMilestoneEnabled !== undefined && {
          notifySubscriberMilestone: dto.subscriberMilestoneEnabled,
        }),
        ...(dto.weeklyDigestEnabled !== undefined && {
          notifyWeeklyDigest: dto.weeklyDigestEnabled,
        }),
        ...(dto.seriesTrendingEnabled !== undefined && {
          notifySeriesTrending: dto.seriesTrendingEnabled,
        }),
        ...(dto.teamMemberJoinedEnabled !== undefined && {
          notifyTeamMemberJoined: dto.teamMemberJoinedEnabled,
        }),
        ...(dto.permissionChangedEnabled !== undefined && {
          notifyPermissionChanged: dto.permissionChangedEnabled,
        }),
      },
      select: this.notificationSettingsSelect,
    })

    this.logger.log({
      event: "creator_notification_settings_updated",
      account_id: accountId,
    })

    return mapCreatorNotificationSettings(profile)
  }
}
