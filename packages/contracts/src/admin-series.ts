/**
 * @sable/contracts — admin series / projects management
 */

import type { SeriesStatus } from "./studio.js"

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
  genre: string
  language: string
  creatorName: string
  episodeCount: number
  /** Null until analytics is wired — UI should render as "-". */
  views: number | null
  status: SeriesStatus
  reviewStatus: AdminSeriesReviewStatus
  publishStatus: AdminSeriesPublishStatus
  posterUrl: string | null
  createdAt: string
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
  /** Null until analytics is wired — UI should render as "-". */
  views: number | null
  status: "published" | "draft" | "processing" | "failed"
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
