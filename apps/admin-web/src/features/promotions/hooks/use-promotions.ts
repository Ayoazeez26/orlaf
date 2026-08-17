import type { AdminListPromotionsQuery } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  approveAdminPromotion,
  endAdminPromotion,
  fetchAdminPromotionDetail,
  fetchAdminPromotionsList,
  pauseAdminPromotion,
  rejectAdminPromotion,
  resumeAdminPromotion,
} from "../api/promotions-api"
import { mapAdminPromotionDetail } from "../lib/map-admin-promotion"

export const adminPromotionsKeys = {
  all: ["admin-promotions"] as const,
  list: (query: AdminListPromotionsQuery) =>
    [...adminPromotionsKeys.all, "list", query] as const,
  detail: (id: string) => [...adminPromotionsKeys.all, "detail", id] as const,
}

export function useAdminPromotionsList(query: AdminListPromotionsQuery) {
  return useQuery({
    queryKey: adminPromotionsKeys.list(query),
    queryFn: async () => {
      const response = await fetchAdminPromotionsList(query)
      return {
        summary: response.summary,
        campaigns: response.campaigns,
      }
    },
  })
}

export function useAdminPromotionDetail(promotionId: string) {
  return useQuery({
    queryKey: adminPromotionsKeys.detail(promotionId),
    queryFn: async () => {
      const detail = await fetchAdminPromotionDetail(promotionId)
      return mapAdminPromotionDetail(detail)
    },
    enabled: Boolean(promotionId),
  })
}

function useInvalidatePromotions() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: adminPromotionsKeys.all })
  }
}

export function useApproveAdminPromotion(promotionId: string) {
  const invalidate = useInvalidatePromotions()
  return useMutation({
    mutationFn: (note?: string) => approveAdminPromotion(promotionId, note),
    onSuccess: () => invalidate(),
  })
}

export function useRejectAdminPromotion(promotionId: string) {
  const invalidate = useInvalidatePromotions()
  return useMutation({
    mutationFn: (note?: string) => rejectAdminPromotion(promotionId, note),
    onSuccess: () => invalidate(),
  })
}

export function usePauseAdminPromotion(promotionId: string) {
  const invalidate = useInvalidatePromotions()
  return useMutation({
    mutationFn: (note?: string) => pauseAdminPromotion(promotionId, note),
    onSuccess: () => invalidate(),
  })
}

export function useResumeAdminPromotion(promotionId: string) {
  const invalidate = useInvalidatePromotions()
  return useMutation({
    mutationFn: () => resumeAdminPromotion(promotionId),
    onSuccess: () => invalidate(),
  })
}

export function useEndAdminPromotion(promotionId: string) {
  const invalidate = useInvalidatePromotions()
  return useMutation({
    mutationFn: (note?: string) => endAdminPromotion(promotionId, note),
    onSuccess: () => invalidate(),
  })
}

export { mapAdminPromotionDetail } from "../lib/map-admin-promotion"
