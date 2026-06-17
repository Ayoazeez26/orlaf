import { useQuery } from "@tanstack/react-query"
import {
  fetchPromotionDetail,
  fetchPromotionsList,
} from "../api/promotions-api"
import { promotionsKeys } from "../data/query-keys"

export function usePromotionsList() {
  return useQuery({
    queryKey: promotionsKeys.list(),
    queryFn: fetchPromotionsList,
  })
}

export function usePromotionDetail(promotionId: string) {
  return useQuery({
    queryKey: promotionsKeys.detail(promotionId),
    queryFn: () => fetchPromotionDetail(promotionId),
  })
}
