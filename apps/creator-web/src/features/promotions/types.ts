import type {
  CreatePromotionRequest,
  PromotionAudience,
  PromotionDetail,
  PromotionGoal,
  PromotionPlacement,
  PromotionStatus,
  PromotionStatusFilter,
  PromotionSummary,
  PromotionsListResponse,
  UpdatePromotionRequest,
} from "@sable/contracts"

export type { PromotionPerformancePoint } from "@sable/contracts"
export type {
  CreatePromotionRequest,
  PromotionAudience,
  PromotionDetail,
  PromotionGoal,
  PromotionPlacement,
  PromotionStatus,
  PromotionStatusFilter,
  PromotionSummary,
  UpdatePromotionRequest,
}

export interface PromotionsSummaryKpi {
  label: string
  value: string
}

export interface PromotionsListData {
  summaryKpis: PromotionsSummaryKpi[]
  promotions: PromotionSummary[]
}

export interface PromotionFormProject {
  id: string
  name: string
}

export interface EstimatedReach {
  impressions: string
  uniqueReach: string
  clicks: string
  footnote: string
}

export function mapPromotionsListResponse(
  response: PromotionsListResponse
): PromotionsListData {
  return {
    summaryKpis: [
      { label: "Active", value: String(response.summary.activeCount) },
      {
        label: "Total Spend",
        value: `$${response.summary.totalSpend.toLocaleString("en-US")}`,
      },
      {
        label: "Impressions",
        value: formatCompactCount(response.summary.totalImpressions),
      },
      { label: "Avg. CTR", value: response.summary.averageCtr },
    ],
    promotions: response.promotions,
  }
}

function formatCompactCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return String(value)
}
