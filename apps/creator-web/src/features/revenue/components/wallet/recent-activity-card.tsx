import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { WalletActivity } from "../../types"

interface RecentActivityCardProps {
  activities: WalletActivity[]
  className?: string
}

export function RecentActivityCard({
  activities,
  className,
}: RecentActivityCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "gap-0 py-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 border-border border-b p-5 pb-5!">
        <p className="font-semibold text-foreground">Recent activity</p>
        <Link
          to="/dashboard/revenue/payouts"
          className="inline-flex items-center gap-0.5 font-medium text-primary text-sm hover:underline"
        >
          See all
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </CardHeader>
      <CardContent className="divide-y divide-border px-0 pb-0">
        {activities.map((activity) => {
          const isCredit = activity.type === "credit"
          const Icon = isCredit ? ArrowUpRight : ArrowDownLeft

          return (
            <div
              key={activity.id}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full",
                    isCredit
                      ? "bg-trend-positive-muted"
                      : "bg-payout-accent-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      isCredit ? "text-trend-positive" : "text-primary"
                    )}
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground text-sm">
                    {activity.label}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {activity.date}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 font-semibold text-sm",
                  isCredit ? "text-trend-positive" : "text-foreground"
                )}
              >
                {activity.amount}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
