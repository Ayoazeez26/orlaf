import type {
  CatalogEpisodeDetail,
  CatalogFeedItem,
  EpisodeAccessType,
  StudioEpisode,
  StudioSeries,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"
import { formatRelativeUpdatedAt } from "../lib/format-relative-time"
import type {
  EpisodeAccess,
  ProjectAnalytics,
  ProjectDetail,
  ProjectSummary,
} from "../types"
import { updateSeries } from "./studio-api"

/** Legacy field on ProjectDetail; charts use useAnalyticsDashboard instead. */
const EMPTY_PROJECT_ANALYTICS: ProjectAnalytics = {
  kpis: [],
  engagementKpis: [],
  viewershipTrend: [],
  devices: [],
  audienceRetention: [],
  trafficSources: [],
}

const STATUS_MAP: Record<StudioSeries["status"], ProjectSummary["status"]> = {
  draft: "draft",
  in_review: "in_review",
  published: "published",
  rejected: "rejected",
  archived: "draft",
}

const ICON_VARIANT_BY_STATUS: Record<
  ProjectSummary["status"],
  ProjectSummary["iconVariant"]
> = {
  published: "purple",
  in_review: "pink",
  rejected: "pink",
  scheduled: "pink",
  draft: "blue",
  ongoing: "purple",
  completed: "purple",
}

function mapAccessType(access: EpisodeAccessType): EpisodeAccess {
  switch (access) {
    case "coin_gated":
      return "coins"
    case "premium":
      return "premium"
    default:
      return "free"
  }
}

function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return "0:00"
  const total = Math.floor(seconds)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function mapSeriesToSummary(
  series: StudioSeries & { _count?: { episodes: number } },
  _index: number
): ProjectSummary {
  const updatedAtMs = new Date(series.updatedAt).getTime()
  const episodeCount = series._count?.episodes ?? series.episodes?.length
  const isShortFilm = series.type === "short_film"
  const status = STATUS_MAP[series.status]

  return {
    id: series.id,
    slug: series.id,
    title: series.title,
    thumbnailUrl: series.posterUrl ?? undefined,
    type: isShortFilm ? "Short film" : "Short series",
    status,
    episodeCount: isShortFilm ? undefined : episodeCount,
    duration: isShortFilm
      ? formatDuration(series.episodes?.[0]?.durationSeconds ?? null)
      : undefined,
    updatedAt: formatRelativeUpdatedAt(updatedAtMs),
    updatedAtMs,
    genre: series.genres[0],
    language: series.language,
    iconVariant: ICON_VARIANT_BY_STATUS[status],
  }
}

function mapEpisode(episode: StudioEpisode, index: number) {
  return {
    id: episode.id,
    number: index + 1,
    title: episode.title,
    duration: formatDuration(episode.durationSeconds),
    views: "0",
    access: mapAccessType(episode.accessType),
    locked: episode.accessType !== "free",
  }
}

export async function fetchProjects(): Promise<ProjectSummary[]> {
  const series = await listSeriesFromStudio()
  return series.map((item, index) => mapSeriesToSummary(item, index))
}

export async function fetchProject(id: string): Promise<ProjectDetail> {
  const series = await getSeriesFromStudio(id)
  const summary = mapSeriesToSummary(series, 0)
  const episodes = (series.episodes ?? []).map(mapEpisode)

  return {
    ...summary,
    description: series.synopsis ?? "",
    totalViews: "0",
    revenue: "$0",
    subscribers: "0",
    avgWatchTime: "0m",
    tags: series.tags,
    createdAt: new Date(series.createdAt).toLocaleDateString(),
    visibility: {
      public: series.isPublic,
      listedInSearch: series.listedInSearch,
      commentsEnabled: series.commentsEnabled,
    },
    monetization: {
      tippingEnabled: series.tippingEnabled,
      seriesRevenue: "$0",
    },
    subtitleTracks:
      series.subtitleLanguages.length > 0
        ? series.subtitleLanguages
        : ["English"],
    autoCaptionEnabled: series.autoCaptions,
    access: "free",
    overviewMetrics: [],
    analyticsMetrics: [],
    analytics: EMPTY_PROJECT_ANALYTICS,
    recentEpisodes: episodes.slice(0, 5),
    episodes,
    weeklyViews: [],
  }
}

export type ProjectSettingsPatch = Partial<
  ProjectDetail["visibility"] &
    ProjectDetail["monetization"] & {
      language?: string
      subtitleTracks?: string[]
      autoCaptionEnabled?: boolean
      access?: ProjectDetail["access"]
    }
>

export async function updateProjectSettings(
  id: string,
  patch: ProjectSettingsPatch
): Promise<ProjectDetail> {
  if (
    patch.public !== undefined ||
    patch.listedInSearch !== undefined ||
    patch.commentsEnabled !== undefined ||
    patch.tippingEnabled !== undefined
  ) {
    await apiRequest(`/api/v1/studio/series/${id}/settings`, {
      method: "PATCH",
      body: JSON.stringify({
        ...(patch.public !== undefined && { isPublic: patch.public }),
        ...(patch.listedInSearch !== undefined && {
          listedInSearch: patch.listedInSearch,
        }),
        ...(patch.commentsEnabled !== undefined && {
          commentsEnabled: patch.commentsEnabled,
        }),
        ...(patch.tippingEnabled !== undefined && {
          tippingEnabled: patch.tippingEnabled,
        }),
      }),
    })
  }

  if (
    patch.language !== undefined ||
    patch.subtitleTracks !== undefined ||
    patch.autoCaptionEnabled !== undefined
  ) {
    await updateSeries(id, {
      ...(patch.language !== undefined && { language: patch.language }),
      ...(patch.subtitleTracks !== undefined && {
        subtitleLanguages: patch.subtitleTracks,
      }),
      ...(patch.autoCaptionEnabled !== undefined && {
        autoCaptions: patch.autoCaptionEnabled,
      }),
    })
  }

  const detail = await fetchProject(id)

  return {
    ...detail,
    ...(patch.access !== undefined && { access: patch.access }),
  }
}

export async function archiveProject(id: string): Promise<void> {
  await apiRequest(`/api/v1/studio/series/${id}/archive`, {
    method: "POST",
    body: JSON.stringify({}),
  })
}

export async function deleteProject(id: string): Promise<void> {
  await apiRequest(`/api/v1/studio/series/${id}`, {
    method: "DELETE",
  })
}

async function listSeriesFromStudio(): Promise<StudioSeries[]> {
  return apiRequest<StudioSeries[]>("/api/v1/studio/series")
}

async function getSeriesFromStudio(id: string): Promise<StudioSeries> {
  return apiRequest<StudioSeries>(`/api/v1/studio/series/${id}`)
}

export type { CatalogEpisodeDetail, CatalogFeedItem }

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
