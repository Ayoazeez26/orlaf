/**
 * Promotions API types — creator studio campaigns and admin review.
 */

export type PromotionStatus =
  | "draft"
  | "pending"
  | "active"
  | "paused"
  | "rejected"
  | "completed"
  | "archived"

/** Admin UI maps `active` → live, `completed` → ended. */
export type AdminPromotionStatus =
  | "pending"
  | "live"
  | "paused"
  | "rejected"
  | "ended"

export type PromotionGoal = "views" | "subscribers" | "watch_time"

export type PromotionPlacement =
  | "home_banner"
  | "series_page"
  | "player_preroll"
  | "for_you_feed"
  | "search_top"

export type PromotionAudience = "all_viewers" | "subscribers" | "new_viewers"

export type PromotionStatusFilter = "all" | PromotionStatus

export type AdminPromotionFilter = "all" | AdminPromotionStatus

export interface PromotionSummary {
  id: string
  title: string
  status: PromotionStatus
  projectName: string
  seriesId: string
  episodeId: string | null
  placement: PromotionPlacement
  placementLabel: string
  startDate: string
  endDate: string
  spent: number
  budget: number
  progressPercent: number
  impressions: number
  impressionsLabel: string
  ctr: string
}

export interface PromotionPerformancePoint {
  day: string
  impressions: number
  clicks: number
}

export interface PromotionDetail extends PromotionSummary {
  goal: PromotionGoal
  audience: PromotionAudience
  description: string | null
  performanceData: PromotionPerformancePoint[]
  submittedAt: string | null
  reviewedAt: string | null
  reviewerNote: string | null
}

export interface PromotionsListSummary {
  activeCount: number
  totalSpend: number
  totalImpressions: number
  averageCtr: string
}

export interface PromotionsListResponse {
  summary: PromotionsListSummary
  promotions: PromotionSummary[]
}

export interface CreatePromotionRequest {
  title: string
  seriesId: string
  episodeId?: string
  description?: string
  goal: PromotionGoal
  placement: PromotionPlacement
  audience?: PromotionAudience
  budget: number
  durationDays: number
  submit?: boolean
}

export interface UpdatePromotionRequest {
  title?: string
  seriesId?: string
  episodeId?: string | null
  description?: string | null
  goal?: PromotionGoal
  placement?: PromotionPlacement
  audience?: PromotionAudience
  budget?: number
  durationDays?: number
}

export interface PromotionActionNoteRequest {
  note?: string
}

export interface AdminPromotionCampaign {
  id: string
  title: string
  creatorId: string
  creatorName: string
  schedule: string
  placement: PromotionPlacement
  placementLabel: string
  spent: number
  budget: number
  impressions: number
  ctr: number
  status: AdminPromotionStatus
}

export interface AdminPromotionActivityEntry {
  id: string
  action: string
  label: string
  note: string | null
  timestamp: string
}

export interface AdminPromotionDetail extends AdminPromotionCampaign {
  projectName: string
  seriesId: string
  goal: PromotionGoal
  audience: PromotionAudience
  reviewerNote: string | null
  activity: AdminPromotionActivityEntry[]
  performanceData: PromotionPerformancePoint[]
}

export interface AdminPromotionsListSummary {
  liveCount: number
  pendingCount: number
  totalImpressions30d: number
  totalSpend30d: number
}

export interface AdminPromotionsListResponse {
  summary: AdminPromotionsListSummary
  campaigns: AdminPromotionCampaign[]
}

export interface AdminCreatePromotionRequest {
  title: string
  creatorId: string
  seriesId: string
  episodeId?: string
  goal: PromotionGoal
  placement: PromotionPlacement
  audience?: PromotionAudience
  budget: number
  durationDays: number
  activate?: boolean
}

export interface AdminListPromotionsQuery {
  status?: AdminPromotionFilter
  search?: string
}

export function toAdminPromotionStatus(
  status: PromotionStatus
): AdminPromotionStatus | null {
  switch (status) {
    case "pending":
      return "pending"
    case "active":
      return "live"
    case "paused":
      return "paused"
    case "rejected":
      return "rejected"
    case "completed":
      return "ended"
    default:
      return null
  }
}

export const PROMOTION_PLACEMENT_LABELS: Record<PromotionPlacement, string> = {
  home_banner: "Home banner",
  series_page: "Series page",
  player_preroll: "Player preroll",
  for_you_feed: "For You feed",
  search_top: "Search top",
}
