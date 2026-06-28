import type {
  ContentFormatId,
  OnboardingProfileData,
  PatchOnboardingBody,
} from "@sable/contracts"
import type { OnboardingData } from "../types"

export function fromApiProfile(
  profile: OnboardingProfileData
): Pick<
  OnboardingData,
  "creatorType" | "studio" | "contentFormats" | "getStartedMode"
> {
  return {
    creatorType: profile.creator_type,
    studio: profile.studio
      ? {
          name: profile.studio.name ?? "",
          teamSize: profile.studio.team_size ?? null,
          website: profile.studio.website ?? "",
        }
      : { name: "", teamSize: null, website: "" },
    contentFormats: profile.content_formats,
    getStartedMode: profile.get_started_mode,
  }
}

export function toCreatorTypePatch(
  creatorType: OnboardingData["creatorType"]
): PatchOnboardingBody {
  return { step: "creator-type", creator_type: creatorType }
}

export function toStudioPatch(data: OnboardingData): PatchOnboardingBody {
  return {
    step: "studio",
    studio: {
      name: data.studio.name || undefined,
      team_size: data.studio.teamSize,
      website: data.studio.website || null,
    },
  }
}

export function toContentPatch(
  formats: ContentFormatId[]
): PatchOnboardingBody {
  return { step: "content", content_formats: formats }
}

export function toGetStartedPatch(
  mode: OnboardingData["getStartedMode"]
): PatchOnboardingBody {
  return { step: "get-started", get_started_mode: mode }
}
