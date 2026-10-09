import type { UpdatePlatformSettingsRequest } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getCreatorsSettings,
  updateCreatorsSettings,
} from "./creators-settings-api"

export const creatorsSettingsKeys = {
  all: ["admin-creators-settings"] as const,
}

export function useCreatorsSettingsQuery() {
  return useQuery({
    queryKey: creatorsSettingsKeys.all,
    queryFn: getCreatorsSettings,
  })
}

export function useUpdateCreatorsSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePlatformSettingsRequest) =>
      updateCreatorsSettings(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: creatorsSettingsKeys.all }),
  })
}
