export type AnalyticsKpiIcon =
  | "views"
  | "viewers"
  | "watchTime"
  | "engagement"
  | "completion"
  | "likes"
  | "shares"
  | "subscribers"
  | "dollar"
  | "chart"
  | "clock"
  | "creditCard"

export interface AnalyticsKpi {
  label: string
  value: string
  changePercent?: number | null
  footnote?: string
  icon: AnalyticsKpiIcon
}

export interface ViewershipTrendPoint {
  bucket: string
  label: string
  views: number
  unique: number
}

export interface DeviceSegment {
  name: string
  value: number
  percent: number
}

export interface EngagementPoint {
  bucket: string
  label: string
  views: number
  likes: number
  shares: number
}

export interface TopEpisodeRow {
  rank: number
  episodeId: string
  episodeTitle: string
  projectId: string
  seriesTitle: string
  views: string
  changePercent: number | null
}

export type AnalyticsDateRangeLabel =
  | "Last 7 days"
  | "Last 30 days"
  | "Last 90 days"

export type AnalyticsRangeKey = "7d" | "30d" | "90d"

export interface AnalyticsDashboardData {
  kpis: AnalyticsKpi[]
  viewershipTrend: ViewershipTrendPoint[]
  devices: DeviceSegment[]
  engagement: EngagementPoint[]
  topEpisodes: TopEpisodeRow[]
  episodeViews: Array<{ episodeId: string; views: number }>
}
