import { Coins, FileText } from "lucide-react"
import type { CoinPurchase } from "../types"
import { PurchaseStatusBadge } from "./coin-badges"

interface PurchaseHistoryTableProps {
  purchases: CoinPurchase[]
}

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

function formatCoins(value: number) {
  return value.toLocaleString("en-US")
}

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
            <th className={HEAD_CLASS}>Receipt</th>
            <th className={HEAD_CLASS}>User</th>
            <th className={HEAD_CLASS}>Bundle</th>
            <th className={HEAD_CLASS}>Coins</th>
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
                <div className="flex items-center gap-2">
                  <FileText
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="font-medium text-foreground">
                    {purchase.receipt}
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
                {purchase.bundleLabel}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Coins className="size-4 text-primary" aria-hidden />
                  {formatCoins(purchase.coins)}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                {purchase.amount}
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
