/**
 * @sable/contracts — profile
 *
 * Shared types for the /api/v1/profile/* endpoints (personal + studio settings).
 */

import type { AccountType } from './auth.js';
import type {
  ContentFormatId,
  CreatorType,
  GetStartedMode,
  OnboardingStepId,
  TeamSize,
} from './onboarding.js';
import type { ImageUploadUrlResponse } from './studio.js';

// ─────────────────────────────────────────────────────────────────────────────
// GET /profile/me
// ─────────────────────────────────────────────────────────────────────────────

export interface CreatorProfileSummary {
  accountId: string;
  creatorType: CreatorType | null;
  studioName: string | null;
  handle: string | null;
  description: string | null;
  logoUrl: string | null;
  plan: string;
  teamSize: TeamSize | null;
  studioWebsite: string | null;
  contentFormats: ContentFormatId[];
  getStartedMode: GetStartedMode | null;
  onboardingStep: OnboardingStepId | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  phone: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  accountType: AccountType;
  status: string;
  createdAt: string;
  creatorProfile: CreatorProfileSummary | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /profile/me
// ─────────────────────────────────────────────────────────────────────────────

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  phone?: string;
  /** Pass `null` to remove the profile photo. */
  avatarUrl?: string | null;
}

export interface UpdateProfileResponse {
  id: string;
  email: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  phone: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /profile/me/social
// ─────────────────────────────────────────────────────────────────────────────

export interface UpdateSocialLinksRequest {
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
}

export interface UpdateSocialLinksResponse {
  instagramUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /profile/studio
// ─────────────────────────────────────────────────────────────────────────────

export interface UpdateStudioRequest {
  studioName?: string;
  handle?: string;
  description?: string;
  logoUrl?: string;
  studioWebsite?: string;
}

export type UpdateStudioResponse = CreatorProfileSummary;

// ─────────────────────────────────────────────────────────────────────────────
// POST /profile/me/avatar-url, POST /profile/studio/logo-url
// ─────────────────────────────────────────────────────────────────────────────

export interface GetImageUploadUrlRequest {
  contentType?: string;
}

export type ProfileImageUploadUrlResponse = ImageUploadUrlResponse;

// ─────────────────────────────────────────────────────────────────────────────
// GET/PATCH /profile/preferences
// ─────────────────────────────────────────────────────────────────────────────

export type DefaultVisibility = 'public' | 'private' | 'unlisted';
export type ColorScheme = 'light' | 'dark' | 'system';

export interface CreatorPreferences {
  defaultContentLanguage: string;
  defaultVisibility: DefaultVisibility;
  commentsEnabledByDefault: boolean;
  autoPublishAfterProcessing: boolean;
  tippingEnabledByDefault: boolean;
  dashboardLanguage: string;
  timezone: string;
  colorScheme: ColorScheme;
  reducedMotion: boolean;
  updatedAt: string;
}

export interface UpdateCreatorPreferencesRequest {
  defaultContentLanguage?: string;
  defaultVisibility?: DefaultVisibility;
  commentsEnabledByDefault?: boolean;
  autoPublishAfterProcessing?: boolean;
  tippingEnabledByDefault?: boolean;
  dashboardLanguage?: string;
  timezone?: string;
  colorScheme?: ColorScheme;
  reducedMotion?: boolean;
}

export type UpdateCreatorPreferencesResponse = CreatorPreferences;

// ─────────────────────────────────────────────────────────────────────────────
// GET/PATCH /profile/notification-settings
// ─────────────────────────────────────────────────────────────────────────────

export interface CreatorNotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  episodePublishedEnabled: boolean;
  newCommentsEnabled: boolean;
  contentFlaggedEnabled: boolean;
  payoutProcessedEnabled: boolean;
  coinPurchasesEnabled: boolean;
  revenueMilestoneEnabled: boolean;
  subscriberMilestoneEnabled: boolean;
  weeklyDigestEnabled: boolean;
  seriesTrendingEnabled: boolean;
  teamMemberJoinedEnabled: boolean;
  permissionChangedEnabled: boolean;
  updatedAt: string;
}

export interface UpdateCreatorNotificationSettingsRequest {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  episodePublishedEnabled?: boolean;
  newCommentsEnabled?: boolean;
  contentFlaggedEnabled?: boolean;
  payoutProcessedEnabled?: boolean;
  coinPurchasesEnabled?: boolean;
  revenueMilestoneEnabled?: boolean;
  subscriberMilestoneEnabled?: boolean;
  weeklyDigestEnabled?: boolean;
  seriesTrendingEnabled?: boolean;
  teamMemberJoinedEnabled?: boolean;
  permissionChangedEnabled?: boolean;
}

export type UpdateCreatorNotificationSettingsResponse =
  CreatorNotificationSettings;
