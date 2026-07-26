export type AnalyticsRangeKey = "7d" | "30d" | "90d"

export interface AnalyticsMetricValue {
  value: number
  change_percent: number | null
}

export interface AnalyticsTrendPoint {
  bucket: string
  label: string
  views: number
  unique: number
}

export interface AnalyticsDeviceSegment {
  name: "Mobile" | "Desktop" | "Tablet" | "TV"
  value: number
  percent: number
}

export interface AnalyticsEngagementPoint {
  bucket: string
  label: string
  views: number
  likes: number
  shares: number
}

export interface AnalyticsTopEpisode {
  rank: number
  episode_id: string
  episode_title: string
  series_id: string
  series_title: string
  views: number
  change_percent: number | null
}

export interface CreatorAnalyticsOverview {
  range: {
    key: AnalyticsRangeKey
    from: string
    to: string
  }
  kpis: {
    total_views: AnalyticsMetricValue
    unique_viewers: AnalyticsMetricValue
    avg_watch_seconds: AnalyticsMetricValue
    engagement_rate: AnalyticsMetricValue
  }
  viewership_trend: AnalyticsTrendPoint[]
  devices: AnalyticsDeviceSegment[]
  engagement: AnalyticsEngagementPoint[]
  top_episodes: AnalyticsTopEpisode[]
}
