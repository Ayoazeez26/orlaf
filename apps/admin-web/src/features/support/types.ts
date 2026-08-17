import type { LucideIcon } from "lucide-react"

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed"

export type TicketPriority = "normal" | "high" | "urgent"

export type TicketCategory = "payments" | "technical" | "account" | "general"

export type TicketUserType = "creator" | "viewer"

export type TicketFilter = "all" | "open" | "active" | "resolved" | "closed"

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
  attachments?: SupportAttachment[]
}

export interface SupportTicket {
  id: string
  reference: string
  userName: string
  userEmail: string
  userInitials: string
  userType: TicketUserType
  subject: string
  preview: string
  category: TicketCategory
  status: TicketStatus
  priority: TicketPriority
  openedAt: string
  lastActivity: string
  messages: SupportMessage[]
}

export interface SupportSummaryStat {
  label: string
  value: number
  icon: LucideIcon
}
