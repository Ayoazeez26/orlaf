/**
 * Studio API types — shared between creator-web and backend.
 */

export type SeriesType = "short_series" | "short_film"

export type SeriesStatus =
  | "draft"
  | "in_review"
  | "published"
  | "rejected"
  | "archived"

export type EpisodeAccessType = "free" | "coin_gated" | "premium"

export type EpisodeStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "ready"
  | "failed"

export interface CastMember {
  fullName: string
  stageName?: string
}

export interface CrewMember {
  fullName: string
  role: string
}

export interface CreateSeriesRequest {
  title: string
  synopsis?: string
  type: SeriesType
  genres?: string[]
  language?: string
  tags?: string[]
  subtitleLanguages?: string[]
  cast?: CastMember[]
  crew?: CrewMember[]
  aiVerticalConversion?: boolean
  autoCaptions?: boolean
  posterUrl?: string
  trailerUrl?: string
}

export interface UpdateSeriesRequest {
  title?: string
  synopsis?: string
  genres?: string[]
  language?: string
  tags?: string[]
  posterUrl?: string
  trailerUrl?: string
  subtitleLanguages?: string[]
  cast?: CastMember[]
  crew?: CrewMember[]
  aiVerticalConversion?: boolean
  autoCaptions?: boolean
}

export interface CreateEpisodeRequest {
  title: string
  synopsis?: string
  accessType?: EpisodeAccessType
  coinPrice?: number
  aiVerticalConversion?: boolean
}

export interface UpdateEpisodeRequest {
  title?: string
  synopsis?: string
  accessType?: EpisodeAccessType
  coinPrice?: number
  aiVerticalConversion?: boolean
}

export interface UploadUrlResponse {
  uploadUrl: string
  videoId: string
}

export interface ImageUploadUrlResponse {
  uploadUrl: string
  imageUrl: string
}

export interface TrailerStatusResponse {
  status: "pending" | "processing" | "ready" | "failed"
  hlsUrl: string | null
}

export interface StudioEpisode {
  id: string
  seriesId: string
  order: number
  title: string
  synopsis: string | null
  videoHostingId: string | null
  hlsUrl: string | null
  dashUrl: string | null
  thumbnailUrl: string | null
  durationSeconds: number | null
  status: EpisodeStatus
  accessType: EpisodeAccessType
  coinPrice: number | null
  aiVerticalConversion: boolean
  createdAt: string
  updatedAt: string
}

export interface StudioSeries {
  id: string
  creatorId: string
  title: string
  synopsis: string | null
  type: SeriesType
  status: SeriesStatus
  genres: string[]
  language: string
  tags: string[]
  subtitleLanguages: string[]
  posterUrl: string | null
  trailerUrl: string | null
  trailerVideoHostingId: string | null
  isPublic: boolean
  listedInSearch: boolean
  commentsEnabled: boolean
  tippingEnabled: boolean
  aiVerticalConversion: boolean
  autoCaptions: boolean
  createdAt: string
  updatedAt: string
  episodes?: StudioEpisode[]
}

export interface CatalogFeedItem {
  id: string
  seriesId: string
  seriesTitle: string
  /** Studio / creator display name when available */
  creatorName: string | null
  title: string
  synopsis: string | null
  thumbnailUrl: string | null
  hlsUrl: string
  durationSeconds: number | null
  accessType: EpisodeAccessType
}

export interface CatalogEpisodeDetail {
  id: string
  seriesId: string
  seriesTitle: string
  title: string
  synopsis: string | null
  thumbnailUrl: string | null
  playbackUrl: string
  durationSeconds: number | null
  accessType: EpisodeAccessType
  trailerUrl: string | null
}

/**
 * Home tab collections. Ranked tabs use engagement; editorial tabs filter
 * `Series.tags` (creators/admins should set these tags on publish).
 *
 * Tag conventions:
 * - old-nollywood → `old-nollywood` | `nollywood`
 * - ai-films → `ai-films` | `ai`
 * - sable-originals → `sable-originals` | `sable-original`
 */
export const CATALOG_COLLECTION_KEYS = [
  "featured",
  "trending",
  "new",
  "popular",
  "old-nollywood",
  "ai-films",
  "sable-originals",
] as const

export type CatalogCollectionKey = (typeof CATALOG_COLLECTION_KEYS)[number]

export interface CatalogCollectionSeries {
  id: string
  title: string
  synopsis: string | null
  type: SeriesType
  genres: string[]
  tags: string[]
  posterUrl: string | null
  publishedAt: string | null
  episodeCount: number
  creatorName: string | null
  /** Windowed view count when the collection is engagement-ranked. */
  viewCount: number | null
}

export interface CatalogCollectionResponse {
  key: CatalogCollectionKey
  title: string
  description: string
  items: CatalogCollectionSeries[]
}

/** Seed list for the genres table — runtime catalog reads from the database. */
export const SERIES_GENRES = [
  "Drama",
  "Romance",
  "Comedy",
  "Thriller",
  "Documentary",
  "Anthology",
  "Sci-Fi",
  "Horror",
  "Music",
  "Action",
] as const

export type SeriesGenre = string

export interface PublicGenre {
  id: string
  name: string
  seriesCount: number
}

export interface PublicSeriesSearchFilters {
  /** Case-insensitive match on title and synopsis */
  q?: string
  /** Match series that include any of these genres */
  genres?: string[]
  type?: SeriesType
}
