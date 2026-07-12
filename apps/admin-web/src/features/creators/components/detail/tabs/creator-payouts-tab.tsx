import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Wallet } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { CreatorPayout } from "../../../types"

interface CreatorPayoutsTabProps {
  payouts: CreatorPayout[]
}

export function CreatorPayoutsTab({ payouts }: CreatorPayoutsTabProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-5 px-6">
        <h2 className="font-semibold text-foreground text-lg tracking-tight">
          Payout History
        </h2>

        <ul className="divide-y divide-border/60">
          {payouts.map((payout) => (
            <li
              key={`${payout.bank}-${payout.date}-${payout.amount}`}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="size-4 text-primary" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground text-sm">
                  {payout.bank} {payout.account}
                </p>
                <p className="text-muted-foreground text-xs">{payout.date}</p>
              </div>
              <p className="shrink-0 font-medium text-foreground text-sm tabular-nums">
                ${payout.amount.toFixed(2)}
              </p>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
                Completed
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
