import type { AdminCreatorDetail } from "@sable/contracts"
import type { Creator, CreatorDetail } from "../types"
import { buildDetail } from "./creator-details"

function formatJoined(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Maps the admin creator API detail into the UI CreatorDetail shape.
 *
 * Identity, status, verification, and bio come from the API. Analytics,
 * projects, and payouts remain placeholder data until those APIs land
 * (Phase 2) — see the creators integration plan.
 */
export function toCreatorDetail(detail: AdminCreatorDetail): CreatorDetail {
  const base: Creator = {
    id: detail.id,
    name: detail.name,
    email: detail.email,
    username: detail.username,
    initials: detail.initials,
    location: detail.location,
    views: detail.views,
    earnings: detail.earnings,
    status: detail.status,
    isVerified: detail.isVerified,
    isNew: detail.isNew,
    joinedAt: detail.joinedAt,
  }

  const placeholder = buildDetail(base)

  return {
    ...placeholder,
    bio: detail.bio ?? placeholder.bio,
    joined: formatJoined(detail.joinedAt),
    role: "Creator",
  }
}
