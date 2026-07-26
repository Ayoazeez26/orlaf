import type {
  AnalyticsRangeKey,
  CreatorAnalyticsOverview,
} from "@sable/contracts"
import type {
  AnalyticsDashboardData,
  AnalyticsDateRangeLabel,
  AnalyticsKpi,
} from "../types"

export const RANGE_LABEL_TO_KEY: Record<
  AnalyticsDateRangeLabel,
  AnalyticsRangeKey
> = {
  "Last 7 days": "7d",
  "Last 30 days": "30d",
  "Last 90 days": "90d",
}

export function formatCompactCount(value: number): string {
  if (value < 1000) return String(Math.round(value))
  if (value < 10_000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }
  if (value < 1_000_000) return `${Math.round(value / 1000)}k`
  return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`
}

export function formatWatchTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function formatEngagementRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}

function toKpi(
  label: string,
  value: string,
  icon: AnalyticsKpi["icon"],
  changePercent: number | null
): AnalyticsKpi {
  return {
    label,
    value,
    icon,
    changePercent: changePercent ?? undefined,
  }
}

export function mapAnalyticsOverview(
  overview: CreatorAnalyticsOverview
): AnalyticsDashboardData {
  const { kpis } = overview

  return {
    kpis: [
      toKpi(
        "Total Views",
        formatCompactCount(kpis.total_views.value),
        "views",
        kpis.total_views.change_percent
      ),
      toKpi(
        "Unique Viewers",
        formatCompactCount(kpis.unique_viewers.value),
        "viewers",
        kpis.unique_viewers.change_percent
      ),
      toKpi(
        "Avg Watch Time",
        formatWatchTime(kpis.avg_watch_seconds.value),
        "watchTime",
        kpis.avg_watch_seconds.change_percent
      ),
      toKpi(
        "Engagement Rate",
        formatEngagementRate(kpis.engagement_rate.value),
        "engagement",
        kpis.engagement_rate.change_percent
      ),
    ],
    viewershipTrend: overview.viewership_trend.map((point) => ({
      bucket: point.bucket,
      label: point.label,
      views: point.views,
      unique: point.unique,
    })),
    devices: overview.devices.map((device) => ({
      name: device.name,
      value: device.value,
      percent: device.percent,
    })),
    engagement: overview.engagement.map((point) => ({
      bucket: point.bucket,
      label: point.label,
      views: point.views,
      likes: point.likes,
      shares: point.shares,
    })),
    topEpisodes: overview.top_episodes.map((episode) => ({
      rank: episode.rank,
      episodeId: episode.episode_id,
      episodeTitle: episode.episode_title,
      projectId: episode.series_id,
      seriesTitle: episode.series_title,
      views: formatCompactCount(episode.views),
      changePercent: episode.change_percent,
    })),
  }
}
