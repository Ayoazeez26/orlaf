import type {
  CreateEpisodeRequest,
  CreateSeriesRequest,
  EpisodeStatus,
  ImageUploadUrlResponse,
  PublicGenre,
  StudioEpisode,
  StudioSeries,
  TrailerStatusResponse,
  UpdateEpisodeRequest,
  UpdateSeriesRequest,
  UploadUrlResponse,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

function studioPath(path: string) {
  return `/api/v1/studio${path}`
}

export async function createSeries(
  body: CreateSeriesRequest
): Promise<StudioSeries> {
  return apiRequest<StudioSeries>(studioPath("/series"), {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function listSeries(status?: string): Promise<StudioSeries[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : ""
  return apiRequest<StudioSeries[]>(studioPath(`/series${query}`))
}

export async function getSeries(seriesId: string): Promise<StudioSeries> {
  return apiRequest<StudioSeries>(studioPath(`/series/${seriesId}`))
}

export async function updateSeries(
  seriesId: string,
  body: UpdateSeriesRequest
): Promise<StudioSeries> {
  return apiRequest<StudioSeries>(studioPath(`/series/${seriesId}`), {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function publishSeries(seriesId: string): Promise<StudioSeries> {
  return apiRequest<StudioSeries>(studioPath(`/series/${seriesId}/publish`), {
    method: "POST",
  })
}

export async function createEpisode(
  seriesId: string,
  body: CreateEpisodeRequest
): Promise<StudioEpisode> {
  return apiRequest<StudioEpisode>(studioPath(`/series/${seriesId}/episodes`), {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function updateEpisode(
  seriesId: string,
  episodeId: string,
  body: UpdateEpisodeRequest
): Promise<StudioEpisode> {
  return apiRequest<StudioEpisode>(
    studioPath(`/series/${seriesId}/episodes/${episodeId}`),
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  )
}

export async function deleteEpisode(
  seriesId: string,
  episodeId: string
): Promise<void> {
  await apiRequest<void>(
    studioPath(`/series/${seriesId}/episodes/${episodeId}`),
    { method: "DELETE" }
  )
}

export async function getEpisode(
  seriesId: string,
  episodeId: string
): Promise<StudioEpisode> {
  return apiRequest<StudioEpisode>(
    studioPath(`/series/${seriesId}/episodes/${episodeId}`)
  )
}

export async function getEpisodeUploadUrl(
  seriesId: string,
  episodeId: string
): Promise<UploadUrlResponse> {
  return apiRequest<UploadUrlResponse>(
    studioPath(`/series/${seriesId}/episodes/${episodeId}/upload-url`),
    { method: "POST" }
  )
}

/** Wizard flow — no series exists yet. */
export async function getImageUploadUrl(
  contentType: string
): Promise<ImageUploadUrlResponse> {
  return apiRequest<ImageUploadUrlResponse>(studioPath("/upload/image"), {
    method: "POST",
    body: JSON.stringify({ contentType }),
  })
}

/** Wizard flow — no series exists yet. */
export async function getWizardTrailerUploadUrl(
  contentType: string
): Promise<UploadUrlResponse> {
  return apiRequest<UploadUrlResponse>(studioPath("/upload/trailer"), {
    method: "POST",
    body: JSON.stringify({ contentType }),
  })
}

/** Edit flow — series already exists. */
export async function getSeriesImageUploadUrl(
  seriesId: string,
  contentType: string
): Promise<ImageUploadUrlResponse> {
  return apiRequest<ImageUploadUrlResponse>(
    studioPath(`/series/${seriesId}/upload/image`),
    {
      method: "POST",
      body: JSON.stringify({ contentType }),
    }
  )
}

/** Edit flow — series already exists. */
export async function getSeriesTrailerUploadUrl(
  seriesId: string
): Promise<UploadUrlResponse> {
  return apiRequest<UploadUrlResponse>(
    studioPath(`/series/${seriesId}/upload/trailer`),
    { method: "POST" }
  )
}

export async function getTrailerStatus(
  videoId: string
): Promise<TrailerStatusResponse> {
  return apiRequest<TrailerStatusResponse>(
    studioPath(`/trailer-status/${videoId}`)
  )
}

export async function waitForEpisodeStatus(
  seriesId: string,
  episodeId: string,
  targetStatus: EpisodeStatus,
  options: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<StudioEpisode> {
  const { intervalMs = 3000, timeoutMs = 600_000 } = options
  const started = Date.now()

  while (Date.now() - started < timeoutMs) {
    const episode = await getEpisode(seriesId, episodeId)

    if (episode.status === targetStatus) {
      return episode
    }

    if (episode.status === "failed") {
      throw new Error(`Episode processing failed: ${episode.title}`)
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new Error("Timed out waiting for episode processing")
}

export async function fetchPublicGenres(): Promise<PublicGenre[]> {
  return apiRequest<PublicGenre[]>("/api/v1/studio/public/genres")
}
