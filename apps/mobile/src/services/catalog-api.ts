import type {
  CatalogEpisodeDetail,
  CatalogFeedItem,
  PublicGenre,
} from "@sable/contracts"
import { apiRequest } from "../lib/http-client"

// ---------------------------------------------------------------------------
// Types — TODO: move to @sable/contracts once stable
// ---------------------------------------------------------------------------

export interface SeriesCreatorProfile {
  studioName: string | null
  handle: string | null
  logoUrl: string | null
}

export interface SeriesCreator {
  displayName: string | null
  avatarUrl: string | null
  creatorProfile: SeriesCreatorProfile | null
}

export interface SeriesEpisodeSummary {
  id: string
  title: string
  synopsis: string | null
  order: number
  season: number
  thumbnailUrl: string | null
  durationSeconds: number | null
  accessType: "free" | "coin_gated" | "premium"
  coinPrice: number | null
}

export interface PublicSeries {
  id: string
  creatorId: string
  title: string
  synopsis: string | null
  type: "short_series" | "short_film"
  status: string
  genres: string[]
  language: string
  tags: string[]
  subtitleLanguages: string[]
  posterUrl: string | null
  trailerUrl: string | null
  isPublic: boolean
  listedInSearch: boolean
  commentsEnabled: boolean
  tippingEnabled: boolean
  cast: { fullName: string; stageName?: string }[]
  crew: { fullName: string; role: string }[]
  aiVerticalConversion: boolean
  autoCaptions: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  defaultAccessType: "free" | "coin_gated" | "premium"
  autoReframeTo916: boolean
  _count: { episodes: number }
  creator: SeriesCreator
  episodes?: SeriesEpisodeSummary[] // only on single series fetch
}

export interface PublicEpisode {
  id: string
  title: string
  synopsis: string | null
  order: number
  season: number
  thumbnailUrl: string | null
  durationSeconds: number | null
  accessType: "free" | "coin_gated" | "premium"
  coinPrice: number | null
  hlsUrl: string | null // null for coin_gated until unlocked
  dashUrl: string | null
  subtitleTracks: unknown[]
  subtitleUrl: string | null
  width: number | null
  height: number | null
}

export type PublicSeriesFilters = {
  q?: string
  genre?: string
  genres?: string[]
  type?: string
}

// ---------------------------------------------------------------------------
// Catalog feed (existing)
// ---------------------------------------------------------------------------

export async function fetchCatalogFeed(): Promise<CatalogFeedItem[]> {
  return apiRequest<CatalogFeedItem[]>("/api/v1/catalog/feed")
}

export async function fetchCatalogEpisode(
  episodeId: string
): Promise<CatalogEpisodeDetail> {
  return apiRequest<CatalogEpisodeDetail>(
    `/api/v1/catalog/episodes/${episodeId}`
  )
}

// ---------------------------------------------------------------------------
// Public studio series (no auth required)
// ---------------------------------------------------------------------------

export async function fetchPublicSeries(
  filters?: PublicSeriesFilters
): Promise<PublicSeries[]> {
  const params = new URLSearchParams()
  if (filters?.q) params.set("q", filters.q)
  if (filters?.genre) params.set("genre", filters.genre)
  if (filters?.genres?.length) {
    for (const genre of filters.genres) {
      params.append("genres", genre)
    }
  }
  if (filters?.type) params.set("type", filters.type)

  const query = params.toString() ? `?${params.toString()}` : ""
  return apiRequest<PublicSeries[]>(`/api/v1/studio/public/series${query}`)
}

export async function fetchPublicGenres(): Promise<PublicGenre[]> {
  return apiRequest<PublicGenre[]>("/api/v1/studio/public/genres")
}

export async function fetchPublicSeriesById(
  seriesId: string
): Promise<PublicSeries> {
  return apiRequest<PublicSeries>(`/api/v1/studio/public/series/${seriesId}`)
}

export async function fetchPublicEpisodeById(
  seriesId: string,
  episodeId: string
): Promise<PublicEpisode> {
  return apiRequest<PublicEpisode>(
    `/api/v1/studio/public/series/${seriesId}/episodes/${episodeId}`
  )
}
