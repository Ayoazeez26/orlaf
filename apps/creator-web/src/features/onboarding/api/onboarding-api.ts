import type {
  CompleteOnboardingResponse,
  OnboardingStatusResponse,
  PatchOnboardingBody,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function getOnboardingStatus(): Promise<OnboardingStatusResponse> {
  return apiRequest<OnboardingStatusResponse>("/api/v1/creators/onboarding", {
    method: "GET",
  })
}

export function patchOnboarding(
  body: PatchOnboardingBody
): Promise<OnboardingStatusResponse> {
  return apiRequest<OnboardingStatusResponse>("/api/v1/creators/onboarding", {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function completeOnboarding(): Promise<CompleteOnboardingResponse> {
  return apiRequest<CompleteOnboardingResponse>(
    "/api/v1/creators/onboarding/complete",
    { method: "POST", body: JSON.stringify({}) }
  )
}
