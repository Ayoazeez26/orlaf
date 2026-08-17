import { useQuery } from "@tanstack/react-query"
import { listSeries } from "@/features/projects/api/studio-api"
import type { PromotionFormProject } from "../types"

export const promotionProjectKeys = {
  all: ["promotion-projects"] as const,
  list: () => [...promotionProjectKeys.all, "list"] as const,
}

export function usePromotionProjects() {
  return useQuery({
    queryKey: promotionProjectKeys.list(),
    queryFn: async (): Promise<PromotionFormProject[]> => {
      const series = await listSeries("published")
      return series
        .filter((item) => item.isPublic)
        .map((item) => ({ id: item.id, name: item.title }))
    },
  })
}
