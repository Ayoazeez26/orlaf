import type { PublicGenre } from "@sable/contracts"
import { useQuery } from "@tanstack/react-query"
import { fetchPublicGenres } from "../api/studio-api"

export function usePublicGenres() {
  return useQuery<PublicGenre[]>({
    queryKey: ["studio", "public", "genres"],
    queryFn: fetchPublicGenres,
    staleTime: 5 * 60 * 1000,
  })
}
