import type { OnboardingStatusResponse, SignInResponse } from "@sable/contracts"
import type { OnboardingStep } from "@/features/onboarding/types"

export type PostSignInDestination =
  | { to: "/onboarding"; search?: { step: OnboardingStep } }
  | { to: "/dashboard" }
  | { to: "/auth/suspended" }
  | { to: "/auth/rejected" }

export function resolvePostSignInRoute(
  session: SignInResponse,
  onboardingStep?: OnboardingStep | null
): PostSignInDestination {
  if (session.account_state === "suspended") {
    return { to: "/auth/suspended" }
  }
  if (session.account_state === "rejected") {
    return { to: "/auth/rejected" }
  }
  if (session.account_state === "pending_approval") {
    return { to: "/dashboard" }
  }
  if (session.needs_consent) {
    return { to: "/onboarding", search: { step: "consent" } }
  }
  if (session.account_state === "onboarding") {
    return {
      to: "/onboarding",
      search: { step: onboardingStep ?? "creator-type" },
    }
  }
  if (session.account_state === "active") {
    return { to: "/dashboard" }
  }
  return { to: "/onboarding", search: { step: "creator-type" } }
}

export function onboardingStepFromApi(
  status: OnboardingStatusResponse
): OnboardingStep | null {
  const step = status.step
  if (!step) return null
  return step
}
