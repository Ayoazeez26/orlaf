import type { AnalyticsMetricValue, AnalyticsRangeKey } from "./analytics.js"

export interface AdminUserGrowthPoint {
  bucket: string
  label: string
  /** New `Account` rows with accountType=user in this bucket. */
  users: number
  /** New `Account` rows with accountType=creator in this bucket. */
  creators: number
}

/**
 * Platform growth analytics for the admin Analytics dashboard.
 * v1 covers New Users KPI + user/creator growth series.
 * Revenue / conversion / retention / funnel stay mocked until billing + retention data exist.
 */
export interface AdminAnalyticsOverview {
  range: {
    key: AnalyticsRangeKey
    from: string
    to: string
  }
  kpis: {
    new_users: AnalyticsMetricValue
    new_creators: AnalyticsMetricValue
  }
  user_growth: AdminUserGrowthPoint[]
}
