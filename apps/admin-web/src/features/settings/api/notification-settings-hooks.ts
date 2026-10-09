import type { UpdatePlatformSettingsRequest } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "./notification-settings-api"

export const notificationSettingsKeys = {
  all: ["admin-notification-settings"] as const,
}

export function useNotificationSettingsQuery() {
  return useQuery({
    queryKey: notificationSettingsKeys.all,
    queryFn: getNotificationSettings,
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePlatformSettingsRequest) =>
      updateNotificationSettings(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.all }),
  })
}
