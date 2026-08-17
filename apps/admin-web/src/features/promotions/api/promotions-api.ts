import type {
  AdminCreatePromotionRequest,
  AdminListPromotionsQuery,
  AdminPromotionDetail,
  AdminPromotionsListResponse,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

const BASE = "/api/v1/admin/promotions"

export async function fetchAdminPromotionsList(
  params?: AdminListPromotionsQuery
): Promise<AdminPromotionsListResponse> {
  const search = new URLSearchParams()
  if (params?.status && params.status !== "all") {
    search.set("status", params.status)
  }
  if (params?.search?.trim()) {
    search.set("search", params.search.trim())
  }

  const query = search.toString()
  return apiRequest<AdminPromotionsListResponse>(
    `${BASE}${query ? `?${query}` : ""}`,
    { method: "GET" }
  )
}

export async function fetchAdminPromotionDetail(
  promotionId: string
): Promise<AdminPromotionDetail> {
  return apiRequest<AdminPromotionDetail>(`${BASE}/${promotionId}`, {
    method: "GET",
  })
}

export async function createAdminPromotion(
  body: AdminCreatePromotionRequest
): Promise<AdminPromotionDetail> {
  return apiRequest<AdminPromotionDetail>(BASE, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function approveAdminPromotion(
  promotionId: string,
  note?: string
): Promise<AdminPromotionDetail> {
  return apiRequest<AdminPromotionDetail>(`${BASE}/${promotionId}/approve`, {
    method: "POST",
    body: JSON.stringify({ note }),
  })
}

export async function rejectAdminPromotion(
  promotionId: string,
  note?: string
): Promise<AdminPromotionDetail> {
  return apiRequest<AdminPromotionDetail>(`${BASE}/${promotionId}/reject`, {
    method: "POST",
    body: JSON.stringify({ note }),
  })
}

export async function pauseAdminPromotion(
  promotionId: string,
  note?: string
): Promise<AdminPromotionDetail> {
  return apiRequest<AdminPromotionDetail>(`${BASE}/${promotionId}/pause`, {
    method: "POST",
    body: JSON.stringify({ note }),
  })
}

export async function resumeAdminPromotion(
  promotionId: string
): Promise<AdminPromotionDetail> {
  return apiRequest<AdminPromotionDetail>(`${BASE}/${promotionId}/resume`, {
    method: "POST",
  })
}

export async function endAdminPromotion(
  promotionId: string,
  note?: string
): Promise<AdminPromotionDetail> {
  return apiRequest<AdminPromotionDetail>(`${BASE}/${promotionId}/end`, {
    method: "POST",
    body: JSON.stringify({ note }),
  })
}
