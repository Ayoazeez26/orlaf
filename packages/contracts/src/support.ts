export type SupportTicketStatus = "open" | "in-progress" | "resolved" | "closed"
export type SupportTicketPriority = "normal" | "high" | "urgent"
export type SupportTicketCategory =
  | "payments"
  | "technical"
  | "account"
  | "general"

export interface SupportAttachment {
  id: string
  fileName: string
  contentType: string
  url: string
}

export interface SupportMessage {
  id: string
  author: string
  isAdmin: boolean
  body: string
  timestamp: string
  attachments: SupportAttachment[]
}

export interface SupportTicket {
  id: string
  reference: string
  userName: string
  userEmail: string
  userInitials: string
  userType: "creator" | "viewer"
  subject: string
  preview: string
  category: SupportTicketCategory
  status: SupportTicketStatus
  priority: SupportTicketPriority
  openedAt: string
  lastActivity: string
  messages: SupportMessage[]
}

export interface SupportTicketListResponse {
  items: SupportTicket[]
  stats: {
    open: number
    active: number
    resolved: number
    closed: number
  }
}

export interface SupportAttachmentInput {
  fileName: string
  contentType: string
  url: string
}

export interface CreateSupportTicketRequest {
  subject: string
  category?: SupportTicketCategory
  description: string
  priority?: SupportTicketPriority
  attachments?: SupportAttachmentInput[]
}

export interface ReplySupportTicketRequest {
  body: string
  attachments?: SupportAttachmentInput[]
}

export interface UpdateSupportTicketRequest {
  status?: SupportTicketStatus
}

export interface SupportAttachmentUploadUrlRequest {
  fileName: string
  contentType: string
}

export interface SupportAttachmentUploadUrlResponse {
  uploadUrl: string
  fileUrl: string
  fileName: string
  contentType: string
}
