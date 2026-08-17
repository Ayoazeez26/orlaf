import type { SeriesType } from "./studio.js"

export interface WatchlistSeriesItem {
  seriesId: string
  title: string
  posterUrl: string | null
  type: SeriesType
  episodeCount: number
  subtitle: string
  savedAt: string
}

export interface WatchlistListResponse {
  items: WatchlistSeriesItem[]
  total: number
}

export interface WatchlistStatusResponse {
  saved: boolean
}

export type DownloadQualityKey = "standard" | "high" | "full_hd"
export type DownloadStatusKey = "queued" | "downloading" | "ready" | "failed"
export type DownloadTargetKey = "current" | "next" | "select" | "all"

export interface CreateDownloadsRequest {
  seriesId: string
  /** Episode the user is currently watching (required for current/next/select). */
  currentEpisodeId?: string
  target: DownloadTargetKey
  quality: DownloadQualityKey
}

export interface DownloadListItem {
  id: string
  seriesId: string
  episodeId: string
  seriesTitle: string
  episodeTitle: string
  episodeNumber: number
  posterUrl: string | null
  quality: DownloadQualityKey
  qualityLabel: string
  status: DownloadStatusKey
  progress: number
  estimatedBytes: number | null
  sizeLabel: string | null
  createdAt: string
  completedAt: string | null
}

export interface DownloadListResponse {
  items: DownloadListItem[]
  total: number
}

export interface FollowedCreatorItem {
  creatorId: string
  name: string
  handle: string | null
  logoUrl: string | null
  verified: boolean
  seriesCount: number
  episodeCount: number
  previewPosterUrls: string[]
  followedAt: string
}

export interface FollowedCreatorsResponse {
  items: FollowedCreatorItem[]
  total: number
}

export interface CreatorFollowStatusResponse {
  following: boolean
}

export interface PublicCreatorProfile {
  id: string
  studioName: string | null
  handle: string | null
  description: string | null
  logoUrl: string | null
  verified: boolean
  seriesCount: number
  followerCount: number
  following: boolean
}

export interface HistoryListItem {
  seriesId: string
  episodeId: string
  seriesTitle: string
  episodeTitle: string
  episodeNumber: number
  posterUrl: string | null
  progressPercent: number
  completed: boolean
  watchedAt: string
}

export interface HistoryListResponse {
  items: HistoryListItem[]
  total: number
}
