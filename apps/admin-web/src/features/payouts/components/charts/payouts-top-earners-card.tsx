import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ProgressRows } from "@/features/workspaces/components/home/progress-rows"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { formatNaira } from "../../lib/format-naira"
import type { TopEarner } from "../../types"

interface PayoutsTopEarnersCardProps {
  earners: TopEarner[]
  className?: string
}

export function PayoutsTopEarnersCard({
  earners,
  className,
}: PayoutsTopEarnersCardProps) {
  const rows = earners.map((earner) => ({
    label: earner.name,
    value: formatNaira(earner.amount),
    percent: earner.percent,
    tone: "primary" as const,
  }))

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground text-lg tracking-tight">
          Top earners
        </p>
        <p className="text-muted-foreground text-sm">Current cycle</p>
      </CardHeader>
      <CardContent>
        <ProgressRows rows={rows} />
      </CardContent>
    </Card>
  )
}
