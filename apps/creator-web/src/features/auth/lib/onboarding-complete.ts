import { ONBOARDING_COMPLETE_KEY } from "../constants"

export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true"
}

export function markOnboardingComplete(): void {
  localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true")
}

export function clearOnboardingComplete(): void {
  localStorage.removeItem(ONBOARDING_COMPLETE_KEY)
}
