import type { SeriesType, WatchlistSeriesItem } from "@sable/contracts"

function formatWatchlistSubtitle(
  type: SeriesType,
  episodeCount: number
): string {
  if (type === "short_film") return "Full Movie"
  if (episodeCount === 1) return "1 Episode"
  return `${episodeCount} Episodes`
}

export function mapWatchlistEntry(entry: {
  savedAt: Date
  series: {
    id: string
    title: string
    posterUrl: string | null
    type: SeriesType
    _count: { episodes: number }
  }
}): WatchlistSeriesItem {
  const episodeCount = entry.series._count.episodes

  return {
    seriesId: entry.series.id,
    title: entry.series.title,
    posterUrl: entry.series.posterUrl,
    type: entry.series.type,
    episodeCount,
    subtitle: formatWatchlistSubtitle(entry.series.type, episodeCount),
    savedAt: entry.savedAt.toISOString(),
  }
}
