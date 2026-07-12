import type {
  RecentlyWatched,
  Streamer,
  StreamerAnalytics,
  StreamerBilling,
  StreamerDetail,
  WatchHistoryItem,
} from "../types"
import { MOCK_STREAMERS } from "./mock-streamers"

type StreamerDetailOverride = Partial<
  Pick<
    StreamerDetail,
    | "episodesWatched"
    | "coinsBalance"
    | "joined"
    | "primaryDevice"
    | "lastActive"
    | "favoriteGenres"
    | "recentlyWatched"
    | "watchHistory"
    | "billing"
    | "analytics"
  >
>

const DEFAULT_RECENTLY_WATCHED: RecentlyWatched[] = [
  { title: "The Returnees", meta: "S1 · E1 · 2h ago", percent: 100 },
  { title: "The Returnees", meta: "S1 · E2 · 2h ago", percent: 100 },
  { title: "The Returnees", meta: "S1 · E3 · Yesterday", percent: 64 },
  { title: "Zulu Dawn", meta: "S1 · E1 · 3d ago", percent: 100 },
  { title: "Jollof Wars", meta: "S1 · E2 · 5d ago", percent: 42 },
]

const DEFAULT_WATCH_HISTORY: WatchHistoryItem[] = [
  {
    series: "The Returnees",
    episode: "S1 · E1",
    title: "The Meeting",
    progress: 100,
    watched: "2 h ago",
  },
  {
    series: "The Returnees",
    episode: "S1 · E2",
    title: "The Contract",
    progress: 100,
    watched: "2 h ago",
  },
  {
    series: "The Returnees",
    episode: "S1 · E3",
    title: "Hidden Truth",
    progress: 64,
    watched: "Yesterday",
  },
  {
    series: "Zulu Dawn",
    episode: "S1 · E1",
    title: "The Crossing",
    progress: 100,
    watched: "3 d ago",
  },
  {
    series: "Jollof Wars",
    episode: "S1 · E1",
    title: "The Recipe Wars",
    progress: 42,
    watched: "5 d ago",
  },
]

const DEFAULT_BILLING: StreamerBilling = {
  lifetimeCoinsSpent: 9400,
  transactions: [
    {
      type: "purchase",
      description: "Coin pack — 500",
      date: "May 18 2026",
      coins: 500,
    },
    {
      type: "unlock",
      description: "The Returnees · E4 unlock",
      date: "May 12 2026",
      coins: -80,
    },
    {
      type: "gift",
      description: "Birthday bonus",
      date: "Apr 14 2026",
      coins: 100,
    },
    {
      type: "unlock",
      description: "Jollof Wars · E2 unlock",
      date: "Mar 30 2026",
      coins: -60,
    },
    {
      type: "purchase",
      description: "Coin pack — 1,200",
      date: "Feb 8 2026",
      coins: 1200,
    },
  ],
}

const DEFAULT_ANALYTICS: StreamerAnalytics = {
  completionRate: 65,
  avgSessionMinutes: 19.3,
  peakWatchHour: "9:00",
  arpu: 148,
  watchHoursByWeek: [
    { week: "W1", hours: 6 },
    { week: "W2", hours: 8 },
    { week: "W3", hours: 12 },
    { week: "W4", hours: 10 },
    { week: "W5", hours: 9 },
    { week: "W6", hours: 11 },
    { week: "W7", hours: 13 },
    { week: "W8", hours: 16 },
    { week: "W9", hours: 12 },
    { week: "W10", hours: 10 },
    { week: "W11", hours: 18 },
    { week: "W12", hours: 14 },
  ],
  genreShare: [
    { genre: "Romance", share: 62 },
    { genre: "Drama", share: 38 },
  ],
  episodesByDay: [
    { day: "Mon", episodes: 4 },
    { day: "Tue", episodes: 2 },
    { day: "Wed", episodes: 12 },
    { day: "Thu", episodes: 8 },
    { day: "Fri", episodes: 16 },
    { day: "Sat", episodes: 10 },
    { day: "Sun", episodes: 2 },
  ],
  topSeries: [
    { title: "The Returnees", hours: 26, episodes: 16 },
    { title: "The Returnees", hours: 26, episodes: 16 },
    { title: "The Returnees", hours: 26, episodes: 16 },
    { title: "The Returnees", hours: 26, episodes: 16 },
    { title: "The Returnees", hours: 26, episodes: 16 },
  ],
}

const DETAIL_OVERRIDES: Record<string, StreamerDetailOverride> = {
  "amaka-johnson": {
    episodesWatched: 421,
    coinsBalance: 1280,
    joined: "Jan 14 2025",
    primaryDevice: "iOS",
    lastActive: "12 min ago",
    favoriteGenres: ["Romance", "Drama"],
    recentlyWatched: DEFAULT_RECENTLY_WATCHED,
    watchHistory: DEFAULT_WATCH_HISTORY,
    billing: DEFAULT_BILLING,
    analytics: { ...DEFAULT_ANALYTICS, arpu: 148 },
  },
}

function computeTags(streamer: Streamer): string[] {
  const tags: string[] = []
  if (streamer.plan === "VIP") tags.push("VIP")
  if (streamer.lifetimeSpend >= 100) tags.push("Top Spender")
  if (streamer.watchHours >= 150) tags.push("Power Viewer")
  if (streamer.isNew) tags.push("New")
  return tags
}

function buildBilling(
  streamer: Streamer,
  override?: StreamerBilling
): StreamerBilling {
  if (override) return override

  const lifetimeCoinsSpent = Math.round(streamer.lifetimeSpend * 63.5)
  return {
    lifetimeCoinsSpent,
    transactions: DEFAULT_BILLING.transactions.map((tx) => ({
      ...tx,
      coins:
        tx.coins > 0
          ? Math.round(tx.coins * (streamer.lifetimeSpend / 148))
          : Math.round(tx.coins * (streamer.lifetimeSpend / 148)),
    })),
  }
}

function buildAnalytics(
  streamer: Streamer,
  override?: StreamerAnalytics
): StreamerAnalytics {
  if (override) return override

  return {
    ...DEFAULT_ANALYTICS,
    arpu: streamer.lifetimeSpend,
    completionRate: Math.min(95, Math.round(50 + streamer.watchHours / 6)),
    avgSessionMinutes: Math.round((streamer.watchHours / 10) * 10) / 10,
  }
}

function buildDetail(streamer: Streamer): StreamerDetail {
  const override = DETAIL_OVERRIDES[streamer.id] ?? {}

  return {
    ...streamer,
    tags: computeTags(streamer),
    episodesWatched:
      override.episodesWatched ?? Math.round(streamer.watchHours * 2.3),
    coinsBalance:
      override.coinsBalance ?? Math.round(streamer.lifetimeSpend * 8.65),
    joined: override.joined ?? "2025",
    primaryDevice: override.primaryDevice ?? "iOS",
    lastActive: override.lastActive ?? "2 days ago",
    favoriteGenres: override.favoriteGenres ?? ["Drama", "Action"],
    recentlyWatched: override.recentlyWatched ?? DEFAULT_RECENTLY_WATCHED,
    watchHistory: override.watchHistory ?? DEFAULT_WATCH_HISTORY,
    billing: buildBilling(streamer, override.billing),
    analytics: buildAnalytics(streamer, override.analytics),
  }
}

export function getStreamerDetail(id: string): StreamerDetail | undefined {
  const streamer = MOCK_STREAMERS.find((s) => s.id === id)
  return streamer ? buildDetail(streamer) : undefined
}
