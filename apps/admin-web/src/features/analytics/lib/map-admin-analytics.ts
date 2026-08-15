import type {
  AdminAnalyticsOverview,
  AnalyticsRangeKey,
} from "@sable/contracts"
import { Eye, PlayCircle, Users } from "lucide-react"
import { MOCK_SUPER_ADMIN_ANALYTICS } from "../data/mock-super-admin-analytics"
import type {
  AnalyticsDateRangeLabel,
  AnalyticsKpi,
  SuperAdminAnalytics,
  UserGrowthPoint,
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
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`
  }
  if (value < 1_000_000) return `${Math.round(value / 1000)}K`
  return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}

/**
 * Merge live growth, views, completion, retention, and watch funnel.
 * Revenue stays mocked until billing exists.
 */
export function mapAdminAnalyticsOverview(
  overview: AdminAnalyticsOverview
): SuperAdminAnalytics {
  const mock = MOCK_SUPER_ADMIN_ANALYTICS

  const revenueKpi = mock.kpis.find((kpi) => kpi.label === "Revenue")

  const liveKpis: AnalyticsKpi[] = [
    ...(revenueKpi ? [revenueKpi] : []),
    {
      label: "Active Users",
      value: formatCompactCount(overview.kpis.new_users.value),
      changePercent: overview.kpis.new_users.change_percent,
      icon: Users,
    },
    {
      label: "Total Views",
      value: formatCompactCount(overview.kpis.total_views.value),
      changePercent: overview.kpis.total_views.change_percent,
      icon: Eye,
    },
    {
      label: "Avg Completion",
      value: formatPercent(overview.kpis.completion_rate.value),
      changePercent: overview.kpis.completion_rate.change_percent,
      icon: PlayCircle,
    },
  ]

  const userGrowth: UserGrowthPoint[] = overview.user_growth.map((point) => ({
    week: point.label,
    users: point.users,
    creators: point.creators,
  }))

  const d14 = overview.retention.find((point) => point.day === "D14")

  return {
    ...mock,
    kpis: liveKpis,
    userGrowth,
    retention: overview.retention.map((point) => ({
      day: point.day,
      retention: point.retention,
    })),
    retentionBadge: d14 ? `${d14.retention}% @ D14` : mock.retentionBadge,
    funnel: {
      subtitle: overview.funnel.subtitle,
      stages: overview.funnel.stages.map((stage) => ({
        label: stage.label,
        count: stage.count,
        percentOfTop: stage.percent_of_top,
        dropPercent: stage.drop_percent,
      })),
    },
  }
}
