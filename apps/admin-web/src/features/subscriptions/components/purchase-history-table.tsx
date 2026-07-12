import { FileText } from "lucide-react"
import { formatNaira } from "@/features/payouts/lib/format-naira"
import type { PurchaseRecord } from "../types"
import { PurchaseStatusBadge } from "./purchase-status-badge"

interface PurchaseHistoryTableProps {
  purchases: PurchaseRecord[]
}

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

export function PurchaseHistoryTable({ purchases }: PurchaseHistoryTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No purchases match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={HEAD_CLASS}>Invoice</th>
            <th className={HEAD_CLASS}>User</th>
            <th className={HEAD_CLASS}>Plan</th>
            <th className={HEAD_CLASS}>Amount</th>
            <th className={HEAD_CLASS}>Method</th>
            <th className={HEAD_CLASS}>Status</th>
            <th className={HEAD_CLASS}>Date</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr
              key={purchase.id}
              className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                    <FileText className="size-4" aria-hidden />
                  </span>
                  <span className="font-medium text-foreground">
                    {purchase.invoice}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {purchase.userName}
                  </p>
                  <p className="truncate text-muted-foreground text-xs">
                    {purchase.userEmail}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {purchase.plan}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground tabular-nums">
                {formatNaira(purchase.amount)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {purchase.method}
              </td>
              <td className="px-4 py-3">
                <PurchaseStatusBadge status={purchase.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {purchase.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
