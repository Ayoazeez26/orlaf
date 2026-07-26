import type {
  DownloadListItem,
  DownloadQualityKey,
  SeriesType,
  WatchlistSeriesItem,
} from "@sable/contracts"

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

const QUALITY_LABEL: Record<DownloadQualityKey, string> = {
  standard: "480p",
  high: "720p",
  full_hd: "1080p",
}

export function formatBytes(bytes: number | null | undefined): string | null {
  if (bytes == null || bytes <= 0) return null
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  if (bytes < 1024 * 1024 * 1024) {
    return `${Math.round(bytes / (1024 * 1024))} MB`
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function estimateBytesForQuality(
  durationSeconds: number | null | undefined,
  quality: DownloadQualityKey
): number | null {
  if (durationSeconds == null || durationSeconds <= 0) return null
  const mbps =
    quality === "standard" ? 1.2 : quality === "high" ? 2.5 : 4.5
  return Math.round((durationSeconds * mbps * 1_000_000) / 8)
}

export function mapDownloadEntry(entry: {
  id: string
  seriesId: string
  episodeId: string
  quality: DownloadQualityKey
  status: DownloadListItem["status"]
  progress: number
  estimatedBytes: bigint | null
  createdAt: Date
  completedAt: Date | null
  series: { title: string; posterUrl: string | null }
  episode: { title: string; order: number }
}): DownloadListItem {
  const estimated =
    entry.estimatedBytes != null ? Number(entry.estimatedBytes) : null

  return {
    id: entry.id,
    seriesId: entry.seriesId,
    episodeId: entry.episodeId,
    seriesTitle: entry.series.title,
    episodeTitle: entry.episode.title,
    episodeNumber: entry.episode.order,
    posterUrl: entry.series.posterUrl,
    quality: entry.quality,
    qualityLabel: QUALITY_LABEL[entry.quality],
    status: entry.status,
    progress: entry.progress,
    estimatedBytes: estimated,
    sizeLabel: formatBytes(estimated),
    createdAt: entry.createdAt.toISOString(),
    completedAt: entry.completedAt?.toISOString() ?? null,
  }
}
