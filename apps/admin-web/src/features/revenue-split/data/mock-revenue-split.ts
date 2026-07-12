import { Clock, DollarSign, Split, TrendingUp } from "lucide-react"
import type { RevenueSplitKpi, RevenueSplitTier } from "../types"

export const REVENUE_SPLIT_KPIS: RevenueSplitKpi[] = [
  {
    label: "Gross revenue (30d)",
    value: "$248,930",
    icon: DollarSign,
    changePercent: 8.1,
  },
  {
    label: "Creator share paid",
    value: "$181,720",
    icon: TrendingUp,
    changePercent: 7.4,
  },
  {
    label: "Platform share",
    value: "$58,210",
    icon: Split,
  },
  {
    label: "Pending payouts",
    value: "$23,440",
    icon: Clock,
  },
]

export const DEFAULT_REVENUE_SPLIT_TIERS: RevenueSplitTier[] = [
  {
    id: "verified",
    label: "Verified",
    creatorPercent: 75,
    platformPercent: 22,
    affiliatePercent: 3,
  },
  {
    id: "top",
    label: "Top",
    creatorPercent: 82,
    platformPercent: 15,
    affiliatePercent: 3,
  },
  {
    id: "exclusive",
    label: "Exclusive",
    creatorPercent: 90,
    platformPercent: 8,
    affiliatePercent: 2,
  },
]
