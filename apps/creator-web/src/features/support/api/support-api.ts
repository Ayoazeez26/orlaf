import type {
  CreateSupportTicketRequest,
  ReplySupportTicketRequest,
  SupportAttachmentUploadUrlRequest,
  SupportAttachmentUploadUrlResponse,
  SupportTicket,
  SupportTicketListResponse,
  UpdateSupportTicketRequest,
} from "@sable/contracts"
import { uploadWithPut } from "@/features/projects/api/studio-upload"
import { apiRequest } from "@/lib/http-client"

export function listCreatorTickets(): Promise<SupportTicketListResponse> {
  return apiRequest<SupportTicketListResponse>("/api/v1/studio/support/tickets")
}

export function getCreatorTicket(id: string): Promise<SupportTicket> {
  return apiRequest<SupportTicket>(`/api/v1/studio/support/tickets/${id}`)
}

export function createCreatorTicket(
  body: CreateSupportTicketRequest
): Promise<SupportTicket> {
  return apiRequest<SupportTicket>("/api/v1/studio/support/tickets", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function replyCreatorTicket(
  id: string,
  body: ReplySupportTicketRequest
): Promise<SupportTicket> {
  return apiRequest<SupportTicket>(
    `/api/v1/studio/support/tickets/${id}/messages`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  )
}

export function updateCreatorTicket(
  id: string,
  body: UpdateSupportTicketRequest
): Promise<SupportTicket> {
  return apiRequest<SupportTicket>(`/api/v1/studio/support/tickets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function getSupportAttachmentUploadUrl(
  body: SupportAttachmentUploadUrlRequest
): Promise<SupportAttachmentUploadUrlResponse> {
  return apiRequest<SupportAttachmentUploadUrlResponse>(
    "/api/v1/studio/support/attachments/upload-url",
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  )
}

export async function uploadSupportAttachments(files: File[]) {
  const uploaded: {
    fileName: string
    contentType: string
    url: string
  }[] = []

  for (const file of files.slice(0, 5)) {
    const contentType = file.type || "application/octet-stream"
    const signed = await getSupportAttachmentUploadUrl({
      fileName: file.name,
      contentType,
    })
    await uploadWithPut(signed.uploadUrl, file, signed.contentType)
    uploaded.push({
      fileName: signed.fileName,
      contentType: signed.contentType,
      url: signed.fileUrl,
    })
  }

  return uploaded
}
