import { Button } from "@workspace/ui/components/button"
import { CheckCircle2, Receipt } from "lucide-react"
import { formatNaira } from "../lib/format-naira"
import type { Payout } from "../types"
import { PayoutStatusBadge } from "./payout-badges"

interface PayoutsTableProps {
  payouts: Payout[]
  onApprove?: (payout: Payout) => void
}

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

export function PayoutsTable({ payouts, onApprove }: PayoutsTableProps) {
  if (payouts.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No payouts match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={HEAD_CLASS}>Reference</th>
            <th className={HEAD_CLASS}>Creator</th>
            <th className={HEAD_CLASS}>Cycle</th>
            <th className={HEAD_CLASS}>Amount</th>
            <th className={HEAD_CLASS}>Method</th>
            <th className={HEAD_CLASS}>Status</th>
            <th className={HEAD_CLASS}>Date</th>
            <th className={HEAD_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr
              key={payout.id}
              className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                    <Receipt className="size-4" aria-hidden />
                  </span>
                  <span className="font-medium text-foreground">
                    {payout.reference}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {payout.creatorName}
                  </p>
                  <p className="truncate text-muted-foreground text-xs">
                    {payout.creatorEmail}
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {payout.cycle}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground tabular-nums">
                {formatNaira(payout.amount)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {payout.method}
              </td>
              <td className="px-4 py-3">
                <PayoutStatusBadge status={payout.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {payout.date}
              </td>
              <td className="px-4 py-3">
                {payout.status === "pending" && onApprove ? (
                  <Button
                    type="button"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => onApprove(payout)}
                  >
                    <CheckCircle2 className="size-3.5" aria-hidden />
                    Approve
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
