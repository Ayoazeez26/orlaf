import type {
  CreateSupportTicketRequest,
  ReplySupportTicketRequest,
  UpdateSupportTicketRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCreatorTicket,
  getCreatorTicket,
  listCreatorTickets,
  replyCreatorTicket,
  updateCreatorTicket,
} from "./support-api"

export const supportKeys = {
  all: ["studio", "support"] as const,
  detail: (id: string) => ["studio", "support", id] as const,
}

export function useCreatorTicketsQuery() {
  return useQuery({
    queryKey: supportKeys.all,
    queryFn: listCreatorTickets,
  })
}

export function useCreatorTicketQuery(id: string | undefined) {
  return useQuery({
    queryKey: supportKeys.detail(id ?? ""),
    queryFn: () => getCreatorTicket(id ?? ""),
    enabled: Boolean(id),
  })
}

function invalidateSupport(
  queryClient: ReturnType<typeof useQueryClient>,
  id?: string
) {
  void queryClient.invalidateQueries({ queryKey: supportKeys.all })
  if (id) {
    void queryClient.invalidateQueries({ queryKey: supportKeys.detail(id) })
  }
}

export function useCreateCreatorTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateSupportTicketRequest) => createCreatorTicket(body),
    onSuccess: () => invalidateSupport(queryClient),
  })
}

export function useReplyCreatorTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: ReplySupportTicketRequest
    }) => replyCreatorTicket(id, body),
    onSuccess: (ticket) => invalidateSupport(queryClient, ticket.id),
  })
}

export function useUpdateCreatorTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: UpdateSupportTicketRequest
    }) => updateCreatorTicket(id, body),
    onSuccess: (ticket) => invalidateSupport(queryClient, ticket.id),
  })
}
