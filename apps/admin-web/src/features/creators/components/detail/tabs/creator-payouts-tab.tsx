import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Wallet } from "lucide-react"
import { useCreatorPayouts } from "@/features/payouts/api/payouts-hooks"
import { PayoutStatusBadge } from "@/features/payouts/components/payout-badges"
import { formatNaira } from "@/features/payouts/lib/format-naira"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"

interface CreatorPayoutsTabProps {
  creatorId: string
}

export function CreatorPayoutsTab({ creatorId }: CreatorPayoutsTabProps) {
  const { data } = useCreatorPayouts(creatorId)
  const payouts = data?.items ?? []

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-5 px-6">
        <h2 className="font-semibold text-foreground text-lg tracking-tight">
          Payout History
        </h2>

        {payouts.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No payout requests for this creator yet.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {payouts.map((payout) => (
              <li
                key={payout.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="size-4 text-primary" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm">
                    {payout.reference} · {payout.method}
                  </p>
                  <p className="text-muted-foreground text-xs">{payout.date}</p>
                </div>
                <p className="shrink-0 font-medium text-foreground text-sm tabular-nums">
                  {formatNaira(payout.amount)}
                </p>
                <PayoutStatusBadge status={payout.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
