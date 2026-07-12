export type ProjectPublishStatus = "published" | "draft"

export type ProjectReviewStatus = "approved" | "pending" | "rejected"

export interface Project {
  id: string
  title: string
  genre: string
  language: string
  creatorName: string
  episodeCount: number
  views: number
  publishStatus: ProjectPublishStatus
  reviewStatus: ProjectReviewStatus
}

export interface ProjectEpisode {
  id: string
  number: number
  title: string
  duration: string
  size: string
  views: number
  status: "published" | "draft"
}

export interface TopPerformingEpisode {
  rank: number
  title: string
  duration: string
  views: number
}

export interface WeeklyViewsPoint {
  day: string
  views: number
}

export interface ProjectAnalytics {
  totalViews: number
  revenue: number
  subscribers: number
  avgWatchTime: string
  viewsThisWeek: WeeklyViewsPoint[]
  topEpisodes: TopPerformingEpisode[]
}

export type ModerationSeverity = "high" | "medium" | "low"

export type ModerationReportStatus = "pending" | "reviewed" | "resolved"

export interface ModerationReport {
  id: string
  content: string
  severity: ModerationSeverity
  reason: string
  status: ModerationReportStatus
  reported: string
}

export interface ProjectDetail extends Project {
  description: string
  created: string
  creatorEmail: string
  creatorUsername: string
  creatorInitials: string
  episodes: ProjectEpisode[]
  topEpisodes: TopPerformingEpisode[]
  analytics: ProjectAnalytics
  moderationReports: ModerationReport[]
}
