/**
 * @sable/contracts — creator onboarding
 */

export type CreatorType = "solo" | "studio"

export type TeamSize = "1-5" | "6-15" | "16-50" | "50+"

export type ContentFormatId =
  | "short-drama"
  | "web-series"
  | "micro-content"
  | "documentary"
  | "ai-films"

export type GetStartedMode = "upload" | "create-series"

export type OnboardingStepId =
  | "creator-type"
  | "studio"
  | "content"
  | "get-started"

export interface OnboardingStudioProfile {
  name?: string
  team_size?: TeamSize | null
  website?: string | null
}

export interface OnboardingProfileData {
  creator_type: CreatorType | null
  studio: OnboardingStudioProfile | null
  content_formats: ContentFormatId[]
  get_started_mode: GetStartedMode | null
}

export interface OnboardingStatusResponse {
  account_state: string
  step: OnboardingStepId | null
  profile: OnboardingProfileData
}

export interface PatchOnboardingBody {
  step?: OnboardingStepId
  creator_type?: CreatorType | null
  studio?: OnboardingStudioProfile | null
  content_formats?: ContentFormatId[]
  get_started_mode?: GetStartedMode | null
}

export interface CompleteOnboardingResponse {
  /** `pending_approval` when CREATOR_REQUIRE_APPROVAL=true (organic signups only). */
  account_state: "active" | "pending_approval"
  redirect: "/dashboard"
}
