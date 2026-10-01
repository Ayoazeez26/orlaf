import type { AdminPayoutStats } from "@sable/contracts"
import { AlertTriangle, CheckCircle2, Clock, Wallet } from "lucide-react"
import type { PayoutSummaryStat } from "../types"

function formatNgnCompact(amountMinor: number): string {
  const amount = amountMinor / 100
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    return `₦${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`
  }
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

export function mapPayoutStats(stats: AdminPayoutStats): PayoutSummaryStat[] {
  return [
    {
      label: "Paid (30d)",
      value: formatNgnCompact(stats.paid_30d_minor),
      icon: Wallet,
    },
    {
      label: "Pending this cycle",
      value: formatNgnCompact(stats.pending_minor),
      icon: Clock,
    },
    {
      label: "Creators paid (30d)",
      value: stats.creators_paid_30d.toLocaleString("en-NG"),
      icon: CheckCircle2,
    },
    {
      label: "On hold",
      value: String(stats.pending_count),
      icon: AlertTriangle,
    },
  ]
}
