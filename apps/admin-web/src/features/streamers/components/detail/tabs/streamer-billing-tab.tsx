import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  MoreHorizontal,
  Wallet,
} from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TRANSACTION_TYPE_BADGE_CLASS } from "../../../constants"
import type { StreamerBilling } from "../../../types"

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

interface StreamerBillingTabProps {
  coinsBalance: number
  lifetimeSpend: number
  billing: StreamerBilling
}

function BillingStatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Coins
}) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="flex flex-col gap-4 p-0 px-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            {label}
          </span>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" strokeWidth={2} aria-hidden />
          </span>
        </div>
        <p className="font-bold text-2xl text-foreground tracking-tight">
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

export function StreamerBillingTab({
  coinsBalance,
  lifetimeSpend,
  billing,
}: StreamerBillingTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <BillingStatCard
          label="Current balance"
          value={coinsBalance.toLocaleString()}
          icon={Coins}
        />
        <BillingStatCard
          label="Lifetime coins spent"
          value={billing.lifetimeCoinsSpent.toLocaleString()}
          icon={ArrowUpRight}
        />
        <BillingStatCard
          label="Lifetime spend"
          value={`$${lifetimeSpend.toFixed(2)}`}
          icon={Wallet}
        />
      </div>

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-0")}>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className={HEAD_CLASS}>Type</th>
                <th className={HEAD_CLASS}>Description</th>
                <th className={HEAD_CLASS}>Date</th>
                <th className={HEAD_CLASS}>Coins</th>
                <th className={HEAD_CLASS}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {billing.transactions.map((tx) => {
                const isCredit = tx.coins > 0

                return (
                  <tr
                    key={`${tx.type}-${tx.date}-${tx.description}`}
                    className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
                          TRANSACTION_TYPE_BADGE_CLASS[tx.type]
                        )}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-foreground">
                      {tx.description}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                      {tx.date}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-medium tabular-nums",
                          isCredit ? "text-emerald-600" : "text-red-600"
                        )}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="size-3.5" aria-hidden />
                        ) : (
                          <ArrowUpRight className="size-3.5" aria-hidden />
                        )}
                        {isCredit ? "+" : ""}
                        {tx.coins.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="size-4" aria-hidden />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
