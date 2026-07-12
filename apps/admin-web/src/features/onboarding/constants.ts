import type { ApplicationStatus, InviteStatus } from "./types"

export type ApplicationFilter = "all" | "pending" | "approved" | "rejected"

export const APPLICATION_FILTERS: { key: ApplicationFilter; label: string }[] =
  [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ]

export type InviteFilter = "all" | "sent" | "accepted" | "expired" | "rejected"

export const INVITE_FILTERS: { key: InviteFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sent", label: "Sent" },
  { key: "accepted", label: "Accepted" },
  { key: "expired", label: "Expired" },
  { key: "rejected", label: "Rejected" },
]

export const APPLICATION_STATUS_BADGE_CLASS: Record<ApplicationStatus, string> =
  {
    pending: "bg-amber-500/10 text-amber-600",
    approved: "bg-emerald-500/10 text-emerald-600",
    rejected: "bg-red-500/10 text-red-600",
  }

export const INVITE_STATUS_BADGE_CLASS: Record<InviteStatus, string> = {
  sent: "bg-primary/10 text-primary",
  accepted: "bg-emerald-500/10 text-emerald-600",
  expired: "bg-muted text-muted-foreground",
  rejected: "bg-red-500/10 text-red-600",
}
