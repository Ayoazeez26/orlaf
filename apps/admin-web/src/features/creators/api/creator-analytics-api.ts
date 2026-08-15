import type { CreatorAnalyticsOverview } from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"
import type { CreatorAnalytics } from "../types"

function formatWatchTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function fetchCreatorAnalytics(
  creatorId: string,
  range = "30d"
): Promise<CreatorAnalyticsOverview> {
  return apiRequest<CreatorAnalyticsOverview>(
    `/api/v1/admin/creators/${encodeURIComponent(creatorId)}/analytics?range=${range}`
  )
}

export function mapCreatorAnalyticsOverview(
  overview: CreatorAnalyticsOverview
): CreatorAnalytics {
  return {
    totalViews: overview.kpis.total_views.value,
    uniqueViewers: overview.kpis.unique_viewers.value,
    avgWatchTime: formatWatchTime(overview.kpis.avg_watch_seconds.value),
    completionRate: overview.kpis.completion_rate.value,
    totalEarnings: 0,
    viewershipTrend: overview.viewership_trend.map((point) => ({
      month: point.label,
      views: point.views,
      previous: point.unique,
    })),
    deviceShare: overview.devices.map((device) => ({
      device: device.name,
      share: device.percent,
    })),
    engagementByDay: overview.engagement.map((point) => ({
      day: point.label,
      likes: point.likes,
      shares: point.shares,
      comments: 0,
    })),
    topEpisodes: overview.top_episodes.map((episode) => ({
      title: episode.episode_title,
      series: episode.series_title,
      views: episode.views,
      trend: episode.change_percent ?? 0,
    })),
    audienceByCountry: [],
  }
}
