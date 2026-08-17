export type ProjectPublishStatus = "published" | "draft"

export type ProjectReviewStatus = "approved" | "pending" | "rejected"

export interface Project {
  id: string
  title: string
  genre: string
  language: string
  creatorName: string
  episodeCount: number
  pendingEpisodeCount: number
  views: number | null
  publishStatus: ProjectPublishStatus
  reviewStatus: ProjectReviewStatus
  /** Vertical 9:16 film poster URL from the creator upload. */
  posterUrl: string | null
}

export interface ProjectEpisode {
  id: string
  number: number
  title: string
  duration: string
  size: string
  views: number | null
  reviewStatus: ProjectReviewStatus
  status: "published" | "draft" | "pending_review"
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

export type ModerationReportStatus =
  | "pending"
  | "reviewed"
  | "resolved"
  | "dismissed"

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
