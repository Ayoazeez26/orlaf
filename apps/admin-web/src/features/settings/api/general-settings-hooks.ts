import type { UpdatePlatformSettingsRequest } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getGeneralSettings,
  updateGeneralSettings,
} from "./general-settings-api"

export const generalSettingsKeys = {
  all: ["admin-general-settings"] as const,
}

export function useGeneralSettingsQuery() {
  return useQuery({
    queryKey: generalSettingsKeys.all,
    queryFn: getGeneralSettings,
  })
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePlatformSettingsRequest) =>
      updateGeneralSettings(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: generalSettingsKeys.all }),
  })
}
