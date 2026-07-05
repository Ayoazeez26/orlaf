import type { CreatorPreferences } from "@sable/contracts"
import { SUBTITLE_TRACK_OPTIONS } from "../constants"
import type { UploadWizardState } from "../types"

export function mapCreatorContentDefaults(
  prefs: CreatorPreferences
): Pick<UploadWizardState, "language" | "subtitleTracks"> {
  const language = prefs.defaultContentLanguage
  const subtitleTracks = (SUBTITLE_TRACK_OPTIONS as readonly string[]).includes(
    language
  )
    ? [language]
    : ["English"]

  return { language, subtitleTracks }
}
