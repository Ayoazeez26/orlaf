import type { UpdatePlatformSettingsRequest } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getModerationSettings,
  updateModerationSettings,
} from "./moderation-settings-api"

export const moderationSettingsKeys = {
  all: ["admin-moderation-settings"] as const,
}

export function useModerationSettingsQuery() {
  return useQuery({
    queryKey: moderationSettingsKeys.all,
    queryFn: getModerationSettings,
  })
}

export function useUpdateModerationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePlatformSettingsRequest) =>
      updateModerationSettings(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: moderationSettingsKeys.all }),
  })
}
