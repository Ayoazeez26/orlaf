import type {
  CastMember,
  CrewMember,
  EpisodeAccessType,
  StudioEpisode,
  StudioSeries,
} from "@sable/contracts"
import type {
  EpisodeAccess,
  PersonEntry,
  SeriesAccess,
  UploadEpisodeDraft,
  UploadWizardState,
} from "../types"
import { formatDuration } from "./media/format-duration"

type StudioSeriesWithExtras = StudioSeries & {
  cast?: CastMember[]
  crew?: CrewMember[]
  defaultAccessType?: "free" | "coin_gated" | "premium"
}

function placeholderFile(name: string) {
  return new File([], name)
}

function mapCast(cast: CastMember[] | undefined): PersonEntry[] {
  if (!cast || cast.length === 0) {
    return [{ id: "cast-1", name: "", role: "" }]
  }
  return cast.map((member, index) => ({
    id: `cast-${index + 1}`,
    name: member.fullName,
    role: member.stageName ?? "",
  }))
}

function mapCrew(crew: CrewMember[] | undefined): PersonEntry[] {
  if (!crew || crew.length === 0) {
    return [{ id: "crew-1", name: "", role: "Director" }]
  }
  return crew.map((member, index) => ({
    id: `crew-${index + 1}`,
    name: member.fullName,
    role: member.role,
  }))
}

function mapAccess(
  defaultAccessType: StudioSeriesWithExtras["defaultAccessType"]
): SeriesAccess {
  return defaultAccessType === "coin_gated" || defaultAccessType === "premium"
    ? "coins"
    : "free"
}

function mapEpisodeAccess(accessType: EpisodeAccessType): EpisodeAccess {
  switch (accessType) {
    case "coin_gated":
      return "coins"
    case "premium":
      return "premium"
    default:
      return "free"
  }
}

function mapEpisode(episode: StudioEpisode): UploadEpisodeDraft {
  const hasVideo = episode.status === "ready" && Boolean(episode.hlsUrl)
  return {
    id: episode.id,
    backendEpisodeId: episode.id,
    title: episode.title,
    synopsis: episode.synopsis ?? "",
    duration: formatDuration(episode.durationSeconds),
    access: mapEpisodeAccess(episode.accessType),
    autoCaption: true,
    media: hasVideo
      ? {
          file: placeholderFile(`${episode.title || "episode"}.mp4`),
          status: "ready",
          progress: 1,
          durationSeconds: episode.durationSeconds ?? undefined,
          previewObjectUrl: episode.thumbnailUrl ?? undefined,
          episodeId: episode.id,
          videoHostingId: episode.videoHostingId ?? undefined,
          hlsUrl: episode.hlsUrl ?? undefined,
        }
      : null,
  }
}

export function mapSeriesEpisodes(
  series: StudioSeriesWithExtras
): UploadEpisodeDraft[] {
  return (series.episodes ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map(mapEpisode)
}

export function mapSeriesToWizardFields(
  series: StudioSeriesWithExtras
): Partial<UploadWizardState> {
  return {
    seriesId: series.id,
    projectType: series.type === "short_film" ? "short-film" : "short-series",
    title: series.title,
    synopsis: series.synopsis ?? "",
    genres: series.genres,
    language: series.language,
    tags: series.tags.join(", "),
    subtitleTracks: series.subtitleLanguages,
    access: mapAccess(series.defaultAccessType),
    aiConversionEnabled: series.aiVerticalConversion,
    autoCaptionEnabled: series.autoCaptions,
    cast: mapCast(series.cast),
    crew: mapCrew(series.crew),
    episodes: mapSeriesEpisodes(series),
    poster: series.posterUrl
      ? {
          file: placeholderFile("poster.jpg"),
          previewObjectUrl: series.posterUrl,
          status: "ready",
          progress: 1,
          remoteUrl: series.posterUrl,
        }
      : null,
    trailer: series.trailerUrl
      ? {
          file: placeholderFile("trailer.mp4"),
          status: "ready",
          progress: 1,
        }
      : null,
    trailerUrl: series.trailerUrl ?? null,
  }
}
