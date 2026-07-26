import type {
  AdminAnalyticsOverview,
  AnalyticsRangeKey,
} from "@sable/contracts"
import { Users } from "lucide-react"
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

/**
 * Merge live growth metrics into the mock dashboard shell.
 * Revenue / conversion / retention / funnel stay mocked until those APIs exist.
 */
export function mapAdminAnalyticsOverview(
  overview: AdminAnalyticsOverview
): SuperAdminAnalytics {
  const mock = MOCK_SUPER_ADMIN_ANALYTICS

  const liveKpis: AnalyticsKpi[] = [
    mock.kpis[0]!, // Revenue — still mocked
    {
      label: "New Users",
      value: formatCompactCount(overview.kpis.new_users.value),
      changePercent: overview.kpis.new_users.change_percent,
      icon: Users,
    },
    mock.kpis[2]!, // Conversion — still mocked
    mock.kpis[3]!, // Avg Completion — still mocked
  ]

  const userGrowth: UserGrowthPoint[] = overview.user_growth.map((point) => ({
    week: point.label,
    users: point.users,
    creators: point.creators,
  }))

  return {
    ...mock,
    kpis: liveKpis,
    userGrowth,
  }
}
