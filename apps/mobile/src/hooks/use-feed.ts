import { useQuery } from "@tanstack/react-query"
import {
  fetchPublicEpisodeById,
  fetchPublicSeries,
  fetchPublicSeriesById,
  type PublicSeriesFilters,
} from "../services/catalog-api"

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const seriesKeys = {
  all: ["series"] as const,
  byId: (id: string) => ["series", id] as const,
  episodes: (seriesId: string) => ["series", seriesId, "episodes"] as const,
  episode: (seriesId: string, episodeId: string) =>
    ["series", seriesId, "episodes", episodeId] as const,
}

export type { PublicSeriesFilters }

// ---------------------------------------------------------------------------
// List all public series
// ---------------------------------------------------------------------------

export function useGetSeries(filters?: PublicSeriesFilters) {
  return useQuery({
    queryKey: [...seriesKeys.all, filters],
    queryFn: () => fetchPublicSeries(filters),
  })
}

// ---------------------------------------------------------------------------
// Get single series by ID (includes episodes list)
// ---------------------------------------------------------------------------

export function useGetSeriesById(id: string) {
  return useQuery({
    queryKey: seriesKeys.byId(id),
    queryFn: () => fetchPublicSeriesById(id),
    enabled: !!id,
  })
}

// ---------------------------------------------------------------------------
// Get single episode by ID (includes hlsUrl for playback)
// ---------------------------------------------------------------------------

export function useGetEpisodeById(seriesId: string, episodeId: string) {
  return useQuery({
    queryKey: seriesKeys.episode(seriesId, episodeId),
    queryFn: () => fetchPublicEpisodeById(seriesId, episodeId),
    enabled: !!seriesId && !!episodeId,
  })
}
