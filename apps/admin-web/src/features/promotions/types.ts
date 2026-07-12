import type { LucideIcon } from "lucide-react"

export type PromotionStatus =
  | "pending"
  | "live"
  | "paused"
  | "rejected"
  | "ended"

export type PromotionFilter = "all" | PromotionStatus

export interface PromotionCampaign {
  id: string
  title: string
  creatorName: string
  schedule: string
  placement: string
  spent: number
  budget: number
  impressions: number
  ctr: number
  status: PromotionStatus
}

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
