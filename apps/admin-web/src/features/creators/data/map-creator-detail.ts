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
 * Identity/status/bio from the API. Analytics tab uses a separate analytics
 * query. Projects load via GET /admin/series?creatorId=. Payouts stay empty
 * until monetization.
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
    earnings: 0,
    status: detail.status,
    isVerified: detail.isVerified,
    isNew: detail.isNew,
    joinedAt: detail.joinedAt,
  }

  const shell = buildDetail(base)

  return {
    ...shell,
    bio: detail.bio?.trim() || shell.bio,
    joined: formatJoined(detail.joinedAt),
    role: "Creator",
  }
}
