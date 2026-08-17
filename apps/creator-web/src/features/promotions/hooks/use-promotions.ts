import type {
  CreatePromotionRequest,
  UpdatePromotionRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  archivePromotion,
  createPromotion,
  endPromotion,
  fetchPromotionDetail,
  fetchPromotionsList,
  pausePromotion,
  resumePromotion,
  submitPromotion,
  updatePromotion,
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
    enabled: Boolean(promotionId),
  })
}

export function useCreatePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionsKeys.list() })
    },
  })
}

export function useUpdatePromotion(promotionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePromotionRequest) =>
      updatePromotion(promotionId, body),
    onSuccess: (data) => {
      queryClient.setQueryData(promotionsKeys.detail(promotionId), data)
      queryClient.invalidateQueries({ queryKey: promotionsKeys.list() })
    },
  })
}

export function useSubmitPromotion(promotionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => submitPromotion(promotionId),
    onSuccess: (data) => {
      queryClient.setQueryData(promotionsKeys.detail(promotionId), data)
      queryClient.invalidateQueries({ queryKey: promotionsKeys.list() })
    },
  })
}

export function usePausePromotion(promotionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => pausePromotion(promotionId),
    onSuccess: (data) => {
      queryClient.setQueryData(promotionsKeys.detail(promotionId), data)
      queryClient.invalidateQueries({ queryKey: promotionsKeys.list() })
    },
  })
}

export function useResumePromotion(promotionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => resumePromotion(promotionId),
    onSuccess: (data) => {
      queryClient.setQueryData(promotionsKeys.detail(promotionId), data)
      queryClient.invalidateQueries({ queryKey: promotionsKeys.list() })
    },
  })
}

export function useEndPromotion(promotionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => endPromotion(promotionId),
    onSuccess: (data) => {
      queryClient.setQueryData(promotionsKeys.detail(promotionId), data)
      queryClient.invalidateQueries({ queryKey: promotionsKeys.list() })
    },
  })
}

export function useArchivePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: archivePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionsKeys.all })
    },
  })
}

export type { CreatePromotionRequest, UpdatePromotionRequest }
