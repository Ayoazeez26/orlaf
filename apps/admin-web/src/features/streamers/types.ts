export type StreamerPlan = "Premium" | "VIP" | "Basic" | "Free"

export type StreamerStatus = "active" | "suspended" | "banned"

export interface Streamer {
  id: string
  name: string
  email: string
  username: string
  initials: string
  plan: StreamerPlan
  location: string
  watchHours: number
  lifetimeSpend: number
  status: StreamerStatus
  isNew: boolean
}

export interface RecentlyWatched {
  title: string
  meta: string
  percent: number
}

export interface WatchHistoryItem {
  series: string
  episode: string
  title: string
  progress: number
  watched: string
}

export type CoinTransactionType = "purchase" | "gift" | "unlock"

export interface CoinTransaction {
  type: CoinTransactionType
  description: string
  date: string
  coins: number
}

export interface StreamerBilling {
  lifetimeCoinsSpent: number
  transactions: CoinTransaction[]
}

export interface WatchHoursPoint {
  week: string
  hours: number
}

export interface GenreShare {
  genre: string
  share: number
}

export interface EpisodesByDayPoint {
  day: string
  episodes: number
}

export interface TopSeriesWatched {
  title: string
  hours: number
  episodes: number
}

export interface StreamerAnalytics {
  completionRate: number
  avgSessionMinutes: number
  peakWatchHour: string
  arpu: number
  watchHoursByWeek: WatchHoursPoint[]
  genreShare: GenreShare[]
  episodesByDay: EpisodesByDayPoint[]
  topSeries: TopSeriesWatched[]
}

export interface StreamerDetail extends Streamer {
  tags: string[]
  episodesWatched: number
  coinsBalance: number
  joined: string
  primaryDevice: string
  lastActive: string
  favoriteGenres: string[]
  recentlyWatched: RecentlyWatched[]
  watchHistory: WatchHistoryItem[]
  billing: StreamerBilling
  analytics: StreamerAnalytics
}
