import type { UpdateUserNotificationSettingsRequest } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mapAdminNotifications } from "../lib/map-admin-notification"
import type { NotificationItem } from "../types"
import {
  fetchNotificationSettings,
  fetchNotifications,
  markAllNotificationsRead,
  setNotificationRead,
  updateNotificationSettings,
} from "./notifications-api"

export const adminNotificationKeys = {
  all: ["admin", "notifications"] as const,
  list: () => [...adminNotificationKeys.all, "list"] as const,
  settings: () => [...adminNotificationKeys.all, "settings"] as const,
}

export function useAdminNotifications() {
  return useQuery({
    queryKey: adminNotificationKeys.list(),
    queryFn: async (): Promise<NotificationItem[]> => {
      const response = await fetchNotifications({ limit: 50 })
      return mapAdminNotifications(response.items)
    },
  })
}

export function useMarkAllAdminNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all })
    },
  })
}

export function useSetAdminNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      setNotificationRead(id, { read }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all })
    },
  })
}

export function useAdminNotificationSettings() {
  return useQuery({
    queryKey: adminNotificationKeys.settings(),
    queryFn: fetchNotificationSettings,
  })
}

export function useUpdateAdminNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateUserNotificationSettingsRequest) =>
      updateNotificationSettings(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminNotificationKeys.settings(),
      })
    },
  })
}
