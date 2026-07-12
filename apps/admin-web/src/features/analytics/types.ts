import type { LucideIcon } from "lucide-react"

export interface AnalyticsKpi {
  label: string
  value: string
  changePercent: number
  icon: LucideIcon
}

export interface RevenuePoint {
  week: string
  revenue: number
  subscriptions: number
}

export interface UserGrowthPoint {
  week: string
  users: number
  creators: number
}

export interface RetentionPoint {
  day: string
  retention: number
}

export interface FunnelStage {
  label: string
  count: number
  /** Share of the top-of-funnel (visitors), 0–100. */
  percentOfTop: number
  /** Drop from the previous stage, negative number (e.g. -58). Null for the first stage. */
  dropPercent: number | null
}

export interface SuperAdminAnalytics {
  kpis: AnalyticsKpi[]
  revenue: RevenuePoint[]
  userGrowth: UserGrowthPoint[]
  retention: RetentionPoint[]
  retentionBadge: string
  funnel: {
    subtitle: string
    stages: FunnelStage[]
  }
}
