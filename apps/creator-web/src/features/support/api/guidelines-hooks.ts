import { useQuery } from "@tanstack/react-query"
import { getGuidelines } from "./guidelines-api"

export function useGuidelinesQuery() {
  return useQuery({
    queryKey: ["guidelines"] as const,
    queryFn: getGuidelines,
    staleTime: 5 * 60 * 1000,
  })
}
