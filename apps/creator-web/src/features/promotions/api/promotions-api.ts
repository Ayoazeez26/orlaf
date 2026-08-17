import type {
  CreatePromotionRequest,
  PromotionDetail,
  PromotionsListResponse,
  UpdatePromotionRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"
import { mapPromotionsListResponse, type PromotionsListData } from "../types"

const BASE = "/api/v1/studio/promotions"

export async function fetchPromotionsList(): Promise<PromotionsListData> {
  const response = await apiRequest<PromotionsListResponse>(BASE, {
    method: "GET",
  })
  return mapPromotionsListResponse(response)
}

export async function fetchPromotionDetail(
  promotionId: string
): Promise<PromotionDetail> {
  return apiRequest<PromotionDetail>(`${BASE}/${promotionId}`, {
    method: "GET",
  })
}

export async function createPromotion(
  body: CreatePromotionRequest
): Promise<PromotionDetail> {
  return apiRequest<PromotionDetail>(BASE, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function updatePromotion(
  promotionId: string,
  body: UpdatePromotionRequest
): Promise<PromotionDetail> {
  return apiRequest<PromotionDetail>(`${BASE}/${promotionId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function submitPromotion(
  promotionId: string
): Promise<PromotionDetail> {
  return apiRequest<PromotionDetail>(`${BASE}/${promotionId}/submit`, {
    method: "POST",
  })
}

export async function pausePromotion(
  promotionId: string
): Promise<PromotionDetail> {
  return apiRequest<PromotionDetail>(`${BASE}/${promotionId}/pause`, {
    method: "POST",
  })
}

export async function resumePromotion(
  promotionId: string
): Promise<PromotionDetail> {
  return apiRequest<PromotionDetail>(`${BASE}/${promotionId}/resume`, {
    method: "POST",
  })
}

export async function endPromotion(
  promotionId: string
): Promise<PromotionDetail> {
  return apiRequest<PromotionDetail>(`${BASE}/${promotionId}/end`, {
    method: "POST",
  })
}

export async function archivePromotion(promotionId: string): Promise<void> {
  await apiRequest(`${BASE}/${promotionId}`, {
    method: "DELETE",
  })
}
