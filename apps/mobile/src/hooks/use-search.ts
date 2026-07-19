import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  fetchPublicGenres,
  fetchPublicSeries,
  type PublicSeriesFilters,
} from "../services/catalog-api"

export const searchKeys = {
  genres: ["search", "genres"] as const,
  results: (filters?: PublicSeriesFilters) =>
    ["search", "results", filters] as const,
}

export type { PublicSeriesFilters }

export function useSearchGenres() {
  return useQuery({
    queryKey: searchKeys.genres,
    queryFn: fetchPublicGenres,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSearchResults(filters?: PublicSeriesFilters) {
  return useQuery({
    queryKey: searchKeys.results(filters),
    queryFn: () => fetchPublicSeries(filters),
    placeholderData: keepPreviousData,
  })
}
