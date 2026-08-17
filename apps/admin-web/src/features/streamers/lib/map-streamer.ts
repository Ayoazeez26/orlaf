import type {
  AdminStreamerDetail,
  AdminStreamerListItem,
} from "@sable/contracts"
import type { Streamer, StreamerDetail } from "../types"

export function mapStreamerListItem(item: AdminStreamerListItem): Streamer {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    username: item.username,
    initials: item.initials,
    plan: "Free",
    location: item.location,
    watchHours: item.watchHours,
    lifetimeSpend: item.lifetimeSpend,
    status: item.status,
    isNew: item.isNew,
  }
}

export function mapStreamerDetail(item: AdminStreamerDetail): StreamerDetail {
  return {
    ...mapStreamerListItem(item),
    tags: [],
    episodesWatched: item.episodesWatched,
    coinsBalance: 0,
    joined: formatJoined(item.joinedAt),
    primaryDevice: item.primaryDevice ?? "—",
    lastActive: item.lastActive ? formatRelative(item.lastActive) : "—",
    favoriteGenres: item.favoriteGenres,
    recentlyWatched: item.recentlyWatched,
    watchHistory: item.watchHistory.map((row) => ({
      series: row.seriesTitle,
      episode: row.episodeLabel,
      title: row.episodeTitle,
      progress: row.progress,
      watched: formatRelative(row.watchedAt),
    })),
    billing: { lifetimeCoinsSpent: 0, transactions: [] },
    analytics: item.analytics,
  }
}

function formatJoined(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatRelative(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
