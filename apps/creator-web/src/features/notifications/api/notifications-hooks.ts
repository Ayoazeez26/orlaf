import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mapCreatorNotifications } from "../lib/map-notification"
import type { NotificationsData } from "../types"
import {
  fetchNotifications,
  markAllNotificationsRead,
  setNotificationRead,
} from "./notifications-api"

export const creatorNotificationKeys = {
  all: ["creator", "notifications"] as const,
  list: () => [...creatorNotificationKeys.all, "list"] as const,
}

export function useCreatorNotifications() {
  return useQuery({
    queryKey: creatorNotificationKeys.list(),
    queryFn: async (): Promise<NotificationsData> => {
      const response = await fetchNotifications({ limit: 50 })
      return { items: mapCreatorNotifications(response.items) }
    },
  })
}

export function useMarkAllCreatorNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creatorNotificationKeys.all })
    },
  })
}

export function useSetCreatorNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      setNotificationRead(id, { read }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creatorNotificationKeys.all })
    },
  })
}
