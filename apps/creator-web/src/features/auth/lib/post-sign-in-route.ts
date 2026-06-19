import type { SignInResponse } from "@sable/contracts"
import { hasCompletedOnboarding } from "./onboarding-complete"

export type PostSignInDestination =
  | { to: "/onboarding"; search?: { step: string } }
  | { to: "/dashboard" }
  | { to: "/auth/suspended" }
  | { to: "/auth/rejected" }
  | { to: "/auth/pending-approval" }

export function resolvePostSignInRoute(
  session: SignInResponse
): PostSignInDestination {
  if (session.account_state === "suspended") {
    return { to: "/auth/suspended" }
  }
  if (session.account_state === "rejected") {
    return { to: "/auth/rejected" }
  }
  if (session.account_state === "pending_approval") {
    return { to: "/auth/pending-approval" }
  }
  if (session.needs_consent) {
    return { to: "/onboarding", search: { step: "consent" } }
  }
  if (hasCompletedOnboarding()) {
    return { to: "/dashboard" }
  }
  return { to: "/onboarding", search: { step: "creator-type" } }
}
