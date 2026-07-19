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
