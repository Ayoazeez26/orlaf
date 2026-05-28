import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowDownRight } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { RecentPayout } from "../../types"

interface RecentPayoutsCardProps {
  payouts: RecentPayout[]
  className?: string
}

export function RecentPayoutsCard({
  payouts,
  className,
}: RecentPayoutsCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "gap-0 py-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-border border-b p-5 pb-5!">
        <p className="font-semibold text-foreground text-sm">Recent Payouts</p>
        <Badge className="border-0 bg-payout-accent-muted font-normal text-primary hover:bg-payout-accent-muted">
          {payouts.length} transactions
        </Badge>
      </CardHeader>
      <CardContent className="divide-y divide-border px-0 pb-0">
        {payouts.map((payout) => (
          <div
            key={payout.id}
            className="flex items-center justify-between gap-4 px-6 py-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-payout-accent-muted">
                <ArrowDownRight
                  className="size-4 text-primary"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground text-sm">
                  {payout.bankLabel}
                </p>
                <p className="text-muted-foreground text-sm">{payout.date}</p>
              </div>
            </div>
            <span className="shrink-0 font-semibold text-foreground text-sm">
              {payout.amount}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
