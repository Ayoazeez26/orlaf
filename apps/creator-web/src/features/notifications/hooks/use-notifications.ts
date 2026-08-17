import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { listInbox, markAllInboxRead, updateInboxItem } from "../api/inbox-api"
import type { NotificationItem, NotificationsData } from "../types"

const inboxKeys = {
  all: ["inbox"] as const,
}

function mapIcon(type: string): NotificationItem["icon"] {
  if (type === "projects") return "shield"
  if (type === "creators") return "users"
  if (type === "moderation") return "shield"
  if (type === "support") return "bell"
  return "bell"
}

export function useNotifications(): {
  data: NotificationsData
  isLoading: boolean
  markAllAsRead: () => void
  markRead: (id: string) => void
} {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: inboxKeys.all,
    queryFn: listInbox,
  })
  const markAll = useMutation({
    mutationFn: markAllInboxRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  })
  const markOne = useMutation({
    mutationFn: (id: string) => updateInboxItem(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  })

  const items: NotificationItem[] = (query.data?.items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.body,
    timestamp: item.timestamp,
    icon: mapIcon(item.type),
    read: item.read,
    href: item.link,
  }))

  return {
    data: { items },
    isLoading: query.isPending,
    markAllAsRead: () => markAll.mutate(),
    markRead: (id: string) => markOne.mutate(id),
  }
}

export type { NotificationItem }
