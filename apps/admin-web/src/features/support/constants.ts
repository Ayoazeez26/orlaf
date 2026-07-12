import type {
  TicketCategory,
  TicketFilter,
  TicketPriority,
  TicketStatus,
} from "./types"

export const TICKET_FILTERS: { key: TicketFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "active", label: "Active" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
]

export const TICKET_STATUS_OPTIONS: TicketStatus[] = [
  "open",
  "in-progress",
  "resolved",
  "closed",
]

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Open",
  "in-progress": "In progress",
  resolved: "Resolved",
  closed: "Closed",
}

export const TICKET_STATUS_BADGE_CLASS: Record<TicketStatus, string> = {
  open: "bg-red-500/10 text-red-600",
  "in-progress": "bg-amber-500/10 text-amber-600",
  resolved: "bg-emerald-500/10 text-emerald-600",
  closed: "bg-muted text-muted-foreground",
}

export const TICKET_PRIORITY_LABEL: Record<TicketPriority, string> = {
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
}

export const TICKET_PRIORITY_BADGE_CLASS: Record<TicketPriority, string> = {
  normal: "bg-muted text-muted-foreground",
  high: "bg-amber-500/10 text-amber-600",
  urgent: "bg-red-500/10 text-red-600",
}

export const TICKET_CATEGORY_LABEL: Record<TicketCategory, string> = {
  payments: "Payments",
  technical: "Technical",
  account: "Account",
  general: "General",
}

export const TICKET_USER_TYPE_LABEL: Record<"creator" | "viewer", string> = {
  creator: "Creator",
  viewer: "Viewer",
}
