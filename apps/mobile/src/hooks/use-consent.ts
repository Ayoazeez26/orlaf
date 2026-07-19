import type { PolicyVersions } from "@sable/contracts"
import { useMutation, useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { apiRequest } from "../lib/http-client"

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const consentKeys = {
  policies: ["policies"] as const,
}

// ---------------------------------------------------------------------------
// GET /auth/policies
// ---------------------------------------------------------------------------

export function usePolicies() {
  return useQuery<PolicyVersions>({
    queryKey: consentKeys.policies,
    queryFn: () => apiRequest<PolicyVersions>("/api/v1/auth/policies"),
    // Policies rarely change — cache for 1 hour
    staleTime: 1000 * 60 * 60,
  })
}

// ---------------------------------------------------------------------------
// POST /auth/users/consent
// ---------------------------------------------------------------------------

export function useRecordConsent() {
  return useMutation<void, Error, PolicyVersions>({
    mutationFn: (policyVersions) =>
      apiRequest("/api/v1/auth/users/consent", {
        method: "POST",
        body: JSON.stringify({ accepted: true, policyVersions }),
      }),
    onSuccess: () => {
      router.replace("/(tabs)/feed")
    },
  })
}
