import type { AnalyticsMetricValue, AnalyticsRangeKey } from "./analytics.js"

export interface AdminUserGrowthPoint {
  bucket: string
  label: string
  /** New `Account` rows with accountType=user in this bucket. */
  users: number
  /** New `Account` rows with accountType=creator in this bucket. */
  creators: number
}

export interface AdminRetentionPoint {
  day: string
  retention: number
}

export interface AdminFunnelStage {
  label: string
  count: number
  percent_of_top: number
  drop_percent: number | null
}

/**
 * Platform growth analytics for the admin Analytics dashboard.
 * Revenue stays mocked until billing exists.
 */
export interface AdminAnalyticsOverview {
  range: {
    key: AnalyticsRangeKey
    from: string
    to: string
  }
  kpis: {
    /** Unique viewer accounts that signed up, liked, or played in the range. */
    new_users: AnalyticsMetricValue
    new_creators: AnalyticsMetricValue
    total_views: AnalyticsMetricValue
    completion_rate: AnalyticsMetricValue
  }
  user_growth: AdminUserGrowthPoint[]
  retention: AdminRetentionPoint[]
  funnel: {
    subtitle: string
    stages: AdminFunnelStage[]
  }
}

export interface AdminAnalyticsSummary {
  total_users: number
  total_creators: number
  published_series: number
  pending_review_series: number
  /** Always 0 until moderation reports exist. */
  flagged_series: number
  views_30d: number
  new_creators_7d: number
}
