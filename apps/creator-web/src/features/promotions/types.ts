import type { LucideIcon } from "lucide-react"

export type PromotionStatus =
  | "active"
  | "paused"
  | "pending"
  | "completed"
  | "draft"

export type PromotionStatusFilter = "all" | PromotionStatus

export type PromotionGoal = "views" | "subscribers" | "watch_time"

export type PromotionPlacement =
  | "home_banner"
  | "series_page"
  | "player_preroll"

export type PromotionAudience = "all_viewers" | "subscribers" | "new_viewers"

export interface PromotionSummary {
  id: string
  title: string
  status: PromotionStatus
  projectName: string
  placement: string
  startDate: string
  endDate: string
  spent: number
  budget: number
  progressPercent: number
  impressions: string
  ctr?: string
}

export interface PromotionPerformancePoint {
  day: string
  impressions: number
}

export interface PromotionDetail extends PromotionSummary {
  ctr: string
  goal: PromotionGoal
  audience: PromotionAudience
  performanceData: PromotionPerformancePoint[]
}

export interface PromotionsSummaryKpi {
  label: string
  value: string
  icon: LucideIcon
}

export interface PromotionsListData {
  summaryKpis: PromotionsSummaryKpi[]
  promotions: PromotionSummary[]
}

export interface EstimatedReach {
  impressions: string
  uniqueReach: string
  clicks: string
  footnote: string
}

export interface PromotionFormProject {
  id: string
  name: string
}
