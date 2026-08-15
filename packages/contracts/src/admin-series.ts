/**
 * @sable/contracts — admin series / projects management
 */

import type { SeriesStatus, SeriesType } from "./studio.js"

export type AdminSeriesReviewStatus = "approved" | "pending" | "rejected"

export type AdminSeriesPublishStatus = "published" | "draft"

export type AdminSeriesListFilter = "all" | "pending-review" | "rejected"

export interface AdminSeriesStats {
  total: number
  pendingReview: number
  approved: number
  rejected: number
}

export interface AdminSeriesListItem {
  id: string
  title: string
  type: SeriesType
  genre: string
  language: string
  creatorName: string
  episodeCount: number
  pendingEpisodeCount: number
  /** Counted playback sessions (`countedAsView`). */
  views: number | null
  status: SeriesStatus
  reviewStatus: AdminSeriesReviewStatus
  publishStatus: AdminSeriesPublishStatus
  posterUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminSeriesListResponse {
  items: AdminSeriesListItem[]
  total: number
  page: number
  pageSize: number
  stats: AdminSeriesStats
}

export interface AdminSeriesListQuery {
  filter?: AdminSeriesListFilter
  /** When set, only series owned by this creator account. */
  creatorId?: string
  q?: string
  page?: number
  pageSize?: number
}

export interface AdminSeriesEpisode {
  id: string
  number: number
  title: string
  duration: string
  size: string
  /** Counted playback sessions (`countedAsView`). */
  views: number | null
  reviewStatus: AdminSeriesReviewStatus
  status: "published" | "draft" | "processing" | "failed" | "pending_review"
}

export interface AdminSeriesDetail extends AdminSeriesListItem {
  synopsis: string | null
  creatorId: string
  creatorEmail: string
  creatorUsername: string
  creatorInitials: string
  publishedAt: string | null
  adminActionNote: string | null
  episodes: AdminSeriesEpisode[]
}

export interface AdminSeriesActionRequest {
  note?: string
}

export interface AdminSeriesActionResponse {
  series: AdminSeriesDetail
}
