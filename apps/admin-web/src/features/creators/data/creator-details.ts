import type { Creator, CreatorDetail } from "../types"

const EMPTY_ANALYTICS: CreatorDetail["analytics"] = {
  totalViews: 0,
  uniqueViewers: 0,
  avgWatchTime: "0:00",
  completionRate: 0,
  totalEarnings: 0,
  viewershipTrend: [],
  deviceShare: [],
  engagementByDay: [],
  topEpisodes: [],
  audienceByCountry: [],
}

/**
 * Base CreatorDetail shell. Analytics charts load via GET /admin/creators/:id/analytics.
 * Projects load via GET /admin/series?creatorId=. Payouts stay empty until monetization.
 */
export function buildDetail(creator: Creator): CreatorDetail {
  return {
    ...creator,
    bio: `${creator.name} is a vertical drama creator based in ${creator.location}.`,
    joined: "—",
    role: "Creator",
    tags: creator.isVerified
      ? ["Creator", "Verified"]
      : creator.isNew
        ? ["Creator", "New"]
        : ["Creator"],
    topProjects: [],
    projects: [],
    analytics: {
      ...EMPTY_ANALYTICS,
      totalViews: creator.views,
      totalEarnings: 0,
    },
    payouts: [],
  }
}

export function formatCreatorViews(views: number): string {
  if (views >= 1_000_000) {
    const value = views / 1_000_000
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}M`
  }
  if (views >= 1_000) {
    const value = views / 1_000
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}K`
  }
  return views.toLocaleString()
}

export function formatCreatorEarnings(amount: number): string {
  return `$${amount.toLocaleString()}`
}
