import type { CreatorNotificationSettings } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchNotificationSettings,
  updateNotificationSettings,
} from "../api/notification-settings-api"
import { profileKeys } from "../data/query-keys"

export function useNotificationSettings() {
  return useQuery({
    queryKey: profileKeys.notificationSettings(),
    queryFn: fetchNotificationSettings,
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: (data) => {
      queryClient.setQueryData<CreatorNotificationSettings>(
        profileKeys.notificationSettings(),
        data
      )
    },
  })
}
