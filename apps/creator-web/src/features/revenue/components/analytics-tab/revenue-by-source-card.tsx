import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { RevenueBySourceItem } from "../../types"
import { RevenueSourceProgressRow } from "../shared/revenue-source-progress-row"

interface RevenueBySourceCardProps {
  items: RevenueBySourceItem[]
  className?: string
}

export function RevenueBySourceCard({
  items,
  className,
}: RevenueBySourceCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-2">
        <p className="font-semibold text-foreground">Revenue by Source</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item) => (
          <RevenueSourceProgressRow
            key={item.label}
            label={item.label}
            amount={item.amount}
            percent={item.percent}
            colorKey={item.colorKey}
          />
        ))}
      </CardContent>
    </Card>
  )
}
