import {
  MOCK_PROMOTION_DETAILS,
  MOCK_PROMOTIONS_LIST,
} from "../data/mock-promotions"
import type { PromotionDetail, PromotionsListData } from "../types"

const MOCK_DELAY_MS = 200

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_DELAY_MS)
  })
}

export async function fetchPromotionsList(): Promise<PromotionsListData> {
  return delay(MOCK_PROMOTIONS_LIST)
}

export async function fetchPromotionDetail(
  promotionId: string
): Promise<PromotionDetail | null> {
  const detail = MOCK_PROMOTION_DETAILS[promotionId] ?? null
  return delay(detail)
}
