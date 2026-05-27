export type ProjectStatus = "published" | "draft" | "ongoing" | "completed"

export type EpisodeAccess = "free" | "coins" | "premium"

export interface ProjectSummary {
  id: string
  slug: string
  title: string
  thumbnailUrl: string
  status: ProjectStatus
  episodeCount: number
  updatedAt: string
  genre?: string
  language?: string
}

export interface ProjectMetric {
  label: string
  value: string
  change: string
  icon: "views" | "revenue" | "subscribers" | "watchTime" | "completion"
}

export interface EpisodeSummary {
  id: string
  number: number
  title: string
  duration: string
  views: string
  revenue?: string
  access: EpisodeAccess
  locked: boolean
}

export interface WeeklyViewPoint {
  day: string
  views: number
}

export interface ProjectDetail extends ProjectSummary {
  description: string
  totalViews: string
  revenue: string
  subscribers: string
  avgWatchTime: string
  tags: string[]
  createdAt: string
  visibility: {
    public: boolean
    listedInSearch: boolean
    commentsEnabled: boolean
  }
  monetization: {
    tippingEnabled: boolean
    seriesRevenue: string
  }
  overviewMetrics: ProjectMetric[]
  analyticsMetrics: ProjectMetric[]
  recentEpisodes: EpisodeSummary[]
  episodes: EpisodeSummary[]
  weeklyViews: WeeklyViewPoint[]
}

export interface UploadEpisodeDraft {
  id: string
  title: string
  synopsis: string
  duration: string
  access: EpisodeAccess
  autoCaption: boolean
}

export interface UploadWizardState {
  step: "info" | "episodes" | "review"
  title: string
  genre: string
  language: string
  synopsis: string
  tags: string
  episodes: UploadEpisodeDraft[]
  guideVisible: boolean
}

export type UploadWizardAction =
  | { type: "SET_STEP"; payload: UploadWizardState["step"] }
  | { type: "SET_FIELD"; payload: Partial<UploadWizardState> }
  | { type: "ADD_EPISODES"; payload: number }
  | {
      type: "UPDATE_EPISODE"
      payload: { id: string; patch: Partial<UploadEpisodeDraft> }
    }
  | { type: "TOGGLE_GUIDE" }
  | { type: "RESET" }
