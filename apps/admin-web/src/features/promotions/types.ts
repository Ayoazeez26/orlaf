import type {
  AdminPromotionCampaign,
  AdminPromotionStatus,
  PromotionGoal,
  PromotionPlacement,
} from "@sable/contracts"
import type { LucideIcon } from "lucide-react"

export type PromotionStatus = AdminPromotionStatus
export type PromotionFilter = "all" | PromotionStatus

export type PromotionCampaign = AdminPromotionCampaign

export interface PromotionSummaryStat {
  label: string
  value: string
  icon: LucideIcon
}

export interface PromotionActivityEntry {
  id: string
  label: string
  timestamp: string
  icon: LucideIcon
}

export interface PromotionCampaignDetail extends PromotionCampaign {
  projectName: string
  reviewerNote: string | null
  activity: PromotionActivityEntry[]
}

export interface NewCampaignFormValues {
  title: string
  seriesId: string
  seriesTitle: string
  creatorId: string
  creatorName: string
  goal: PromotionGoal
  placement: PromotionPlacement
  budget: number
  durationDays: number
}
