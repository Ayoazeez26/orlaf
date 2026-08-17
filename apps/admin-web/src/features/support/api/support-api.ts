import type {
  ReplySupportTicketRequest,
  SupportTicketListResponse,
  UpdateSupportTicketRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function listAdminTickets(): Promise<SupportTicketListResponse> {
  return apiRequest<SupportTicketListResponse>("/api/v1/admin/support/tickets")
}

export function updateAdminTicket(
  id: string,
  body: UpdateSupportTicketRequest
): Promise<unknown> {
  return apiRequest(`/api/v1/admin/support/tickets/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function replyAdminTicket(
  id: string,
  body: ReplySupportTicketRequest
): Promise<unknown> {
  return apiRequest(
    `/api/v1/admin/support/tickets/${encodeURIComponent(id)}/messages`,
    { method: "POST", body: JSON.stringify(body) }
  )
}
