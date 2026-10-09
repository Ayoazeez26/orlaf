/**
 * @sable/contracts — platform settings
 *
 * Platform-wide singleton configuration, managed from admin Settings →
 * General. platformName/primaryRegion/defaultLanguage are display-only —
 * not editable via UpdatePlatformSettingsRequest, not consumed by the
 * product yet.
 */

export interface PlatformSettings {
  platformName: string
  tagline: string
  supportEmail: string
  primaryRegion: string
  defaultLanguage: string
  maintenanceMode: boolean
  pauseSignups: boolean
  /** When true, admins without an enrolled authenticator are forced to set one up on next sign-in. */
  requireAdmin2fa: boolean
  /** Display-only — not enforced against actual session/JWT expiry. */
  sessionTimeoutMinutes: number
  /** Display-only — not enforced against incoming request IPs. */
  allowedIpRanges: string
  /** Consumed by the nightly audit-log retention cleanup job. */
  auditLogRetentionDays: number
  /** Display-only — no report/export feature exists yet to apply this to. */
  maskPiiInReports: boolean
  /** Consumed by the creator-facing series publish flow. */
  reviewMode: ReviewMode
  /** When true, forces manual review even under an auto review mode. */
  requireThumbnailApproval: boolean
  /** Display-only — no content classifier exists yet to apply this to. */
  autoFlagAdultContent: boolean
  /** Strike count at which a creator is auto-suspended. */
  strikesBeforeSuspension: number
  /** Days an auto-escalated suspension lasts. 0 means permanent. */
  suspensionLengthDays: number
  /** Master switch for the personalized feed — when false, /catalog/feed returns nothing. */
  discoveryEnableForYou: boolean
  /** 0-100. Scales how much viewer-affinity (recently watched creators) boosts feed ranking. */
  discoveryPersonalizationStrength: number
  /** When true, series from creators the viewer has recently watched rank higher in the feed. */
  discoveryIncludeRecentCreators: boolean
  /** When true, series from creators in their first week rank higher in the feed. */
  discoveryBoostNewCreators: boolean
  /** When true (and no curated rail overrides it), the "new" home collection is populated. */
  discoveryShowNewRail: boolean
  /** Display-only — no hero-rotation scheduler exists yet. */
  heroRotationInterval: string
  /** Display-only — no home-layout aggregator caps rail count yet. */
  maxRailsOnHome: number
  /** Platform-wide switches — any admin with Settings access edits these for the whole team. */
  adminAlertCreatorApplications: boolean
  adminAlertContentReview: boolean
  adminAlertThumbnailFlagged: boolean
  adminAlertPayoutCompleted: boolean
  /** Display-only — no weekly digest job exists yet. */
  adminAlertWeeklyDigest: boolean
  /** Where admin alert emails are sent. Empty means no email is sent, only the in-app inbox. */
  adminAlertsEmail: string
  /** Reskins creator-web, admin-web, and mobile at runtime. */
  brandingPrimaryColor: string
  brandingAccentColor: string
  brandingDarkModeDefault: boolean
  brandingLogoUrl: string
  brandingShareImageUrl: string
  /** Enforced on creator sign-up (email + OAuth). */
  creatorSignupMode: CreatorSignupMode
  /** Replaces the old CREATOR_REQUIRE_APPROVAL env var. */
  creatorRequireApproval: boolean
  /** When true, an invited creator skips approval even if creatorRequireApproval is on. */
  creatorAutoApproveInvited: boolean
  /** Display-only — no KYC/ID-upload feature exists yet. */
  creatorRequireGovernmentId: boolean
  /** Display-only — no application-questions step exists in creator sign-up yet. */
  creatorApplicationQuestions: string
  /** Enforced by AdminCreatorsService.verify(). */
  creatorVerifyMinAccountAgeDays: number
  creatorVerifyMinPublishedSeries: number
  creatorVerifyRequireZeroStrikes: boolean
  updatedAt: string
}

export type CreatorSignupMode = "invite_only" | "open" | "closed"

export const CREATOR_SIGNUP_CLOSED_ERROR_CODE = "creator_signup_closed"
export const CREATOR_SIGNUP_REQUIRES_INVITE_ERROR_CODE =
  "creator_signup_requires_invite"

/** Public subset served unauthenticated to every surface for runtime reskinning. */
export interface PublicBrandingSettings {
  primaryColor: string
  accentColor: string
  darkModeDefault: boolean
  logoUrl: string
  shareImageUrl: string
}

export type ReviewMode = "manual" | "auto_spot_check" | "auto_publish"

export interface UpdatePlatformSettingsRequest {
  tagline?: string
  supportEmail?: string
  maintenanceMode?: boolean
  pauseSignups?: boolean
  requireAdmin2fa?: boolean
  sessionTimeoutMinutes?: number
  allowedIpRanges?: string
  auditLogRetentionDays?: number
  maskPiiInReports?: boolean
  reviewMode?: ReviewMode
  requireThumbnailApproval?: boolean
  autoFlagAdultContent?: boolean
  strikesBeforeSuspension?: number
  suspensionLengthDays?: number
  discoveryEnableForYou?: boolean
  discoveryPersonalizationStrength?: number
  discoveryIncludeRecentCreators?: boolean
  discoveryBoostNewCreators?: boolean
  discoveryShowNewRail?: boolean
  heroRotationInterval?: string
  maxRailsOnHome?: number
  adminAlertCreatorApplications?: boolean
  adminAlertContentReview?: boolean
  adminAlertThumbnailFlagged?: boolean
  adminAlertPayoutCompleted?: boolean
  adminAlertWeeklyDigest?: boolean
  adminAlertsEmail?: string
  brandingPrimaryColor?: string
  brandingAccentColor?: string
  brandingDarkModeDefault?: boolean
  brandingLogoUrl?: string
  brandingShareImageUrl?: string
  creatorSignupMode?: CreatorSignupMode
  creatorRequireApproval?: boolean
  creatorAutoApproveInvited?: boolean
  creatorRequireGovernmentId?: boolean
  creatorApplicationQuestions?: string
  creatorVerifyMinAccountAgeDays?: number
  creatorVerifyMinPublishedSeries?: number
  creatorVerifyRequireZeroStrikes?: boolean
}

export interface BrandingAssetUploadUrlRequest {
  assetType: "logo" | "share-image"
  contentType: string
}

export interface BrandingAssetUploadUrlResponse {
  uploadUrl: string
  imageUrl: string
}

export const PLATFORM_MAINTENANCE_ERROR_CODE = "platform_maintenance_mode"
export const PLATFORM_SIGNUPS_PAUSED_ERROR_CODE = "platform_signups_paused"
