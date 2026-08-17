import type {
  AdminPromotionCampaign,
  AdminPromotionStatus,
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
  creatorName: string
  placement: string
  budget: number
  durationDays: number
}
