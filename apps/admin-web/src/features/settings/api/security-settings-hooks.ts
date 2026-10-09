import type { UpdatePlatformSettingsRequest } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getSecuritySettings,
  updateSecuritySettings,
} from "./security-settings-api"

export const securitySettingsKeys = {
  all: ["admin-security-settings"] as const,
}

export function useSecuritySettingsQuery() {
  return useQuery({
    queryKey: securitySettingsKeys.all,
    queryFn: getSecuritySettings,
  })
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePlatformSettingsRequest) =>
      updateSecuritySettings(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: securitySettingsKeys.all }),
  })
}
