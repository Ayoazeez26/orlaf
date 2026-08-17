import type {
  SupportTicketCategory,
  SupportTicketStatus,
} from "@sable/contracts"
import type { TicketPriorityChoice, TicketTopic } from "./types"

export const SUPPORT_FIELD_CLASS =
  "rounded-xl border-border bg-input-bg shadow-none dark:bg-input-bg"

export const TICKET_TOPIC_OPTIONS: { id: TicketTopic; label: string }[] = [
  { id: "payouts", label: "Payouts" },
  { id: "promotions", label: "Promotions" },
  { id: "uploads", label: "Content & uploads" },
  { id: "account", label: "Account & security" },
  { id: "other", label: "Other" },
]

export const TICKET_PRIORITY_OPTIONS: {
  id: TicketPriorityChoice
  label: string
}[] = [
  { id: "normal", label: "Normal" },
  { id: "high", label: "High" },
  { id: "urgent", label: "Urgent" },
]

export function topicToCategory(topic: TicketTopic): SupportTicketCategory {
  if (topic === "payouts") return "payments"
  if (topic === "uploads") return "technical"
  if (topic === "account") return "account"
  return "general"
}

export function priorityToApi(priority: TicketPriorityChoice) {
  return priority
}

export const TICKET_CATEGORY_LABEL: Record<SupportTicketCategory, string> = {
  payments: "Payouts",
  technical: "Content & uploads",
  account: "Account",
  general: "General",
}

export const TICKET_STATUS_LABEL: Record<SupportTicketStatus, string> = {
  open: "Open",
  "in-progress": "In progress",
  resolved: "Resolved",
  closed: "Closed",
}

export const TICKET_STATUS_BADGE_CLASS: Record<SupportTicketStatus, string> = {
  open: "bg-primary/10 text-primary",
  "in-progress": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  resolved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  closed: "bg-muted text-muted-foreground",
}
