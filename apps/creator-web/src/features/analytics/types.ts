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
  changePercent?: number
  footnote?: string
  icon: AnalyticsKpiIcon
}

export interface ViewershipTrendPoint {
  month: string
  mobile: number
  desktop: number
}

export interface DeviceSegment {
  name: string
  value: number
  percent: number
}

export interface EngagementByDevicePoint {
  month: string
  mobile: number
  desktop: number
  tablet: number
}

export interface TopEpisodeRow {
  rank: number
  episodeId: string
  episodeTitle: string
  projectId: string
  seriesTitle: string
  views: string
  changePercent: number
}

export interface AnalyticsDashboardData {
  kpis: AnalyticsKpi[]
  viewershipTrend: ViewershipTrendPoint[]
  devices: DeviceSegment[]
  engagementByDevice: EngagementByDevicePoint[]
  topEpisodes: TopEpisodeRow[]
}
