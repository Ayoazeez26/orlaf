import type {
  ReplySupportTicketRequest,
  UpdateSupportTicketRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  listAdminTickets,
  replyAdminTicket,
  updateAdminTicket,
} from "./support-api"

export const adminSupportKeys = {
  all: ["admin", "support"] as const,
}

export function useAdminTicketsQuery() {
  return useQuery({
    queryKey: adminSupportKeys.all,
    queryFn: listAdminTickets,
  })
}

export function useUpdateAdminTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: UpdateSupportTicketRequest
    }) => updateAdminTicket(id, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminSupportKeys.all }),
  })
}

export function useReplyAdminTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: ReplySupportTicketRequest
    }) => replyAdminTicket(id, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminSupportKeys.all }),
  })
}
