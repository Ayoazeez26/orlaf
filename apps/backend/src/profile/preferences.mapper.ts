import type { CreatorPreferences } from "@sable/contracts"
import type { CreatorProfile } from "../generated/prisma/client"
import { DEFAULT_CREATOR_PREFERENCES } from "./preferences.constants"

type PreferencesProfile = Pick<
  CreatorProfile,
  | "defaultContentLanguage"
  | "defaultVisibility"
  | "commentsEnabledByDefault"
  | "autoPublishAfterProcessing"
  | "tippingEnabledByDefault"
  | "dashboardLanguage"
  | "timezone"
  | "colorScheme"
  | "reducedMotion"
  | "updatedAt"
>

export function mapCreatorPreferences(
  profile: PreferencesProfile | null
): CreatorPreferences {
  if (!profile) {
    return { ...DEFAULT_CREATOR_PREFERENCES }
  }

  return {
    defaultContentLanguage: profile.defaultContentLanguage,
    defaultVisibility:
      profile.defaultVisibility as CreatorPreferences["defaultVisibility"],
    commentsEnabledByDefault: profile.commentsEnabledByDefault,
    autoPublishAfterProcessing: profile.autoPublishAfterProcessing,
    tippingEnabledByDefault: profile.tippingEnabledByDefault,
    dashboardLanguage: profile.dashboardLanguage,
    timezone: profile.timezone,
    colorScheme: profile.colorScheme as CreatorPreferences["colorScheme"],
    reducedMotion: profile.reducedMotion,
    updatedAt: profile.updatedAt.toISOString(),
  }
}
