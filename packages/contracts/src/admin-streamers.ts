/**
 * @sable/contracts — admin streamers (viewer accounts)
 */

import type { AdminSuspendDuration } from "./admin-creators.js"

export type AdminStreamerStatus = "active" | "suspended"

export interface AdminStreamerListItem {
  id: string
  name: string
  email: string
  username: string
  initials: string
  location: string
  watchHours: number
  episodesWatched: number
  lifetimeSpend: number
  status: AdminStreamerStatus
  isNew: boolean
  joinedAt: string
}

export interface AdminStreamerStats {
  total: number
  active: number
  suspended: number
  newThisMonth: number
}

export interface AdminStreamerListResponse {
  items: AdminStreamerListItem[]
  total: number
  page: number
  pageSize: number
  stats: AdminStreamerStats
}

export type AdminStreamerListFilter = "all" | "active" | "suspended" | "new"

export interface AdminStreamerListQuery {
  filter?: AdminStreamerListFilter
  q?: string
  page?: number
  pageSize?: number
}

export interface AdminStreamerWatchHistoryItem {
  episodeId: string
  seriesTitle: string
  episodeLabel: string
  episodeTitle: string
  progress: number
  watchedAt: string
}

export interface AdminStreamerRecentlyWatched {
  title: string
  meta: string
  percent: number
}

export interface AdminStreamerWatchHoursPoint {
  week: string
  hours: number
}

export interface AdminStreamerGenreShare {
  genre: string
  share: number
}

export interface AdminStreamerEpisodesByDay {
  day: string
  episodes: number
}

export interface AdminStreamerTopSeries {
  title: string
  hours: number
  episodes: number
}

export interface AdminStreamerAnalytics {
  completionRate: number
  avgSessionMinutes: number
  peakWatchHour: string
  arpu: number
  watchHoursByWeek: AdminStreamerWatchHoursPoint[]
  genreShare: AdminStreamerGenreShare[]
  episodesByDay: AdminStreamerEpisodesByDay[]
  topSeries: AdminStreamerTopSeries[]
}

export interface AdminStreamerDetail extends AdminStreamerListItem {
  lastActive: string | null
  primaryDevice: string | null
  suspendedAt: string | null
  suspendedUntil: string | null
  suspendReason: string | null
  favoriteGenres: string[]
  recentlyWatched: AdminStreamerRecentlyWatched[]
  watchHistory: AdminStreamerWatchHistoryItem[]
  analytics: AdminStreamerAnalytics
}

export type AdminSuspendStreamerRequest = {
  duration: AdminSuspendDuration
  reason?: string
}
