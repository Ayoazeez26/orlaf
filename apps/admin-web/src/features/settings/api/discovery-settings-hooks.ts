import type { UpdatePlatformSettingsRequest } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getDiscoverySettings,
  updateDiscoverySettings,
} from "./discovery-settings-api"

export const discoverySettingsKeys = {
  all: ["admin-discovery-settings"] as const,
}

export function useDiscoverySettingsQuery() {
  return useQuery({
    queryKey: discoverySettingsKeys.all,
    queryFn: getDiscoverySettings,
  })
}

export function useUpdateDiscoverySettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePlatformSettingsRequest) =>
      updateDiscoverySettings(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: discoverySettingsKeys.all }),
  })
}
