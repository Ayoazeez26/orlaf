import type {
  AdminApplicationDetail,
  AdminApplicationListItem,
  AdminInviteListItem,
} from "@sable/contracts"
import type {
  ApplicationDetail,
  OnboardingApplication,
  OnboardingInvite,
} from "../types"

export function formatRelative(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"

  const diffMs = Date.now() - date.getTime()
  const minutes = Math.round(diffMs / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`

  const weeks = Math.round(days / 7)
  if (weeks < 5) return `${weeks}w ago`

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function toApplication(
  item: AdminApplicationListItem
): OnboardingApplication {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    username: item.username,
    initials: item.initials,
    location: item.location || "—",
    source: item.source,
    submitted: formatRelative(item.submittedAt),
    status: item.status,
  }
}

export function toApplicationDetail(
  detail: AdminApplicationDetail
): ApplicationDetail {
  return {
    ...toApplication(detail),
    bio:
      detail.bio ??
      `${detail.name} is an aspiring creator${
        detail.location ? ` based in ${detail.location}` : ""
      }.`,
    checklist: detail.checklist,
  }
}

export function toInvite(item: AdminInviteListItem): OnboardingInvite {
  return {
    id: item.id,
    email: item.email,
    status: item.status,
    sentBy: item.sentBy,
    sent: formatRelative(item.sentAt),
  }
}
