import type { ProfileResponse } from "@sable/contracts"

export function getWorkspaceDisplayName(
  profile: ProfileResponse,
  fallbackName?: string
): string {
  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()

  return (
    profile.creatorProfile?.studioName?.trim() ||
    fullName ||
    profile.displayName?.trim() ||
    fallbackName?.trim() ||
    "Your workspace"
  )
}
