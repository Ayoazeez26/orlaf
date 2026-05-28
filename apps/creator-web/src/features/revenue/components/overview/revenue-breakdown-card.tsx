import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { RevenueBreakdownItem } from "../../types"

interface RevenueBreakdownCardProps {
  items: RevenueBreakdownItem[]
  className?: string
}

export function RevenueBreakdownCard({
  items,
  className,
}: RevenueBreakdownCardProps) {
  const maxPercent = Math.max(...items.map((i) => i.percent), 1)

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground">Revenue Breakdown</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item) => {
          const Icon = item.icon
          const width = (item.percent / maxPercent) * 100

          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm">
                  <Icon
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                </span>
                <span className="font-medium text-foreground text-sm">
                  {item.amount}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-revenue-breakdown-gradient"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
