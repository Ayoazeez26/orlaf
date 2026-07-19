import type {
  ColorScheme,
  CreatorPreferences,
  DefaultVisibility,
} from "@sable/contracts"

export const DEFAULT_CREATOR_PREFERENCES: CreatorPreferences = {
  defaultContentLanguage: "English",
  defaultVisibility: "public",
  commentsEnabledByDefault: true,
  autoPublishAfterProcessing: false,
  tippingEnabledByDefault: false,
  dashboardLanguage: "English",
  timezone: "Africa/Lagos",
  colorScheme: "system",
  reducedMotion: false,
  updatedAt: new Date(0).toISOString(),
}

export const DEFAULT_VISIBILITY_VALUES: DefaultVisibility[] = [
  "public",
  "private",
  "unlisted",
]

export const COLOR_SCHEME_VALUES: ColorScheme[] = ["light", "dark", "system"]

export function visibilityToSeriesFields(visibility: DefaultVisibility) {
  switch (visibility) {
    case "public":
      return { isPublic: true, listedInSearch: true }
    case "unlisted":
      return { isPublic: true, listedInSearch: false }
    case "private":
      return { isPublic: false, listedInSearch: false }
  }
}
