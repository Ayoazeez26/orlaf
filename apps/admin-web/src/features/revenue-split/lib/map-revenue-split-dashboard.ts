import type { AdminRevenueSplitDashboard } from "@sable/contracts"
import { Clock, DollarSign, Split, TrendingUp } from "lucide-react"
import type { RevenueSplitKpi, RevenueSplitTier } from "../types"

function formatMinor(amountMinor: number): string {
  const major = amountMinor / 100
  if (major >= 1_000_000) {
    const millions = major / 1_000_000
    return `₦${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`
  }
  return `₦${major.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

const KPI_ICONS = [DollarSign, TrendingUp, Split, Clock] as const

export function mapRevenueSplitDashboard(data: AdminRevenueSplitDashboard): {
  kpis: RevenueSplitKpi[]
  tiers: RevenueSplitTier[]
} {
  return {
    kpis: data.kpis.map((kpi, index) => ({
      label: kpi.label,
      value: formatMinor(kpi.value_minor),
      icon: KPI_ICONS[index] ?? DollarSign,
      changePercent: kpi.change_percent,
    })),
    tiers: data.tiers.map((tier) => ({
      id: tier.id,
      label: tier.label,
      creatorPercent: tier.creator_percent,
      platformPercent: tier.platform_percent,
      affiliatePercent: tier.affiliate_percent,
    })),
  }
}
