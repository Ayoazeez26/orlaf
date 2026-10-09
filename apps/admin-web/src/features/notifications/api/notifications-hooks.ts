import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mapAdminNotifications } from "../lib/map-admin-notification"
import type { NotificationItem } from "../types"
import {
  fetchNotifications,
  markAllNotificationsRead,
  setNotificationRead,
} from "./notifications-api"

export const adminNotificationKeys = {
  all: ["admin", "notifications"] as const,
  list: () => [...adminNotificationKeys.all, "list"] as const,
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
