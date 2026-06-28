export type ProjectStatus =
  | "published"
  | "draft"
  | "in_review"
  | "scheduled"
  | "ongoing"
  | "completed"

export type ProjectIconVariant = "purple" | "pink" | "blue"

export type ProjectsStatusFilter = "all" | ProjectStatus

export type EpisodeAccess = "free" | "coins" | "premium"

export type MediaJobStatus =
  | "idle"
  | "probing"
  | "converting"
  | "uploading"
  | "processing"
  | "ready"
  | "failed"

export interface UploadMediaAsset {
  file: File
  status: MediaJobStatus
  progress: number
  error?: string
  durationSeconds?: number
  previewObjectUrl?: string
  episodeId?: string
  videoHostingId?: string
  hlsUrl?: string
}

export interface UploadPosterAsset {
  file: File
  previewObjectUrl: string
  status: MediaJobStatus
  progress: number
  error?: string
  remoteUrl?: string
}

export interface ProjectSummary {
  id: string
  slug: string
  title: string
  thumbnailUrl?: string
  type: string
  status: ProjectStatus
  episodeCount?: number
  duration?: string
  updatedAt: string
  /** Sortable timestamp for list ordering (mock / API) */
  updatedAtMs: number
  genre?: string
  language?: string
  views?: string
  iconVariant: ProjectIconVariant
}

export type ProjectSortOption = "newest" | "title-asc"

export interface ProjectsListFilters {
  searchQuery: string
  statusFilter: ProjectsStatusFilter
  sort: ProjectSortOption
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

export type ProjectType = "short-series" | "short-film"
export type SeriesAccess = "free" | "coins"

export interface PersonEntry {
  id: string
  name: string
  role: string
}

export interface UploadEpisodeDraft {
  id: string
  backendEpisodeId?: string
  title: string
  synopsis: string
  duration: string
  access: EpisodeAccess
  autoCaption: boolean
  media: UploadMediaAsset | null
}

export interface UploadWizardState {
  step: "info" | "episodes" | "review"
  seriesId: string | null
  projectType: ProjectType
  title: string
  genres: string[]
  language: string
  synopsis: string
  tags: string
  access: SeriesAccess
  aiConversionEnabled: boolean
  autoCaptionEnabled: boolean
  subtitleTracks: string[]
  cast: PersonEntry[]
  crew: PersonEntry[]
  episodes: UploadEpisodeDraft[]
  guideVisible: boolean
  trailer: UploadMediaAsset | null
  trailerUrl: string | null
  poster: UploadPosterAsset | null
  publishError: string | null
  isPublishing: boolean
  isContinuing: boolean
  continueError: string | null
}

export type UploadWizardAction =
  | { type: "SET_STEP"; payload: UploadWizardState["step"] }
  | { type: "SET_FIELD"; payload: Partial<UploadWizardState> }
  | { type: "TOGGLE_GENRE"; payload: string }
  | { type: "TOGGLE_SUBTITLE"; payload: string }
  | {
      type: "UPDATE_PERSON"
      payload: {
        list: "cast" | "crew"
        id: string
        patch: Partial<PersonEntry>
      }
    }
  | { type: "ADD_PERSON"; payload: "cast" | "crew" }
  | {
      type: "REMOVE_PERSON"
      payload: { list: "cast" | "crew"; id: string }
    }
  | { type: "ADD_EPISODES"; payload: number }
  | {
      type: "UPDATE_EPISODE"
      payload: { id: string; patch: Partial<UploadEpisodeDraft> }
    }
  | { type: "REMOVE_EPISODE"; payload: { id: string } }
  | { type: "TOGGLE_GUIDE" }
  | { type: "SET_TRAILER"; payload: UploadMediaAsset | null }
  | { type: "UPDATE_TRAILER"; payload: Partial<UploadMediaAsset> }
  | { type: "SET_POSTER"; payload: UploadPosterAsset | null }
  | { type: "UPDATE_POSTER"; payload: Partial<UploadPosterAsset> }
  | { type: "SET_TRAILER_URL"; payload: string | null }
  | { type: "SET_SERIES_ID"; payload: string | null }
  | { type: "RESET" }
