import type { LucideIcon } from "lucide-react"

export type RevenueSplitTierId = "verified" | "top" | "exclusive"

export interface RevenueSplitTier {
  id: RevenueSplitTierId
  label: string
  creatorPercent: number
  platformPercent: number
  affiliatePercent: number
}

export interface RevenueSplitKpi {
  label: string
  value: string
  icon: LucideIcon
  changePercent?: number
}
