import type { InboxNotificationType } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { NotificationCategory, NotificationItem } from "../types"
import { listInbox, markAllInboxRead, updateInboxItem } from "./inbox-api"

export const inboxKeys = {
  all: ["admin", "inbox"] as const,
}

function mapCategory(type: InboxNotificationType): NotificationCategory {
  if (type === "moderation") return "moderation"
  if (type === "creators") return "creators"
  if (type === "projects") return "projects"
  if (type === "support") return "support"
  return "system"
}

export function useAdminInboxQuery() {
  return useQuery({
    queryKey: inboxKeys.all,
    queryFn: listInbox,
  })
}

export function useInboxItems(): NotificationItem[] {
  const { data } = useAdminInboxQuery()
  return (data?.items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    category: mapCategory(item.type),
    timestamp: item.timestamp,
    isRead: item.read,
    needsReview: item.type === "moderation" && !item.read,
    href: item.link,
  }))
}

export function useMarkInboxRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      updateInboxItem(id, { read }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  })
}

export function useMarkAllInboxRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllInboxRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  })
}
