import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ProgressRows } from "@/features/workspaces/components/home/progress-rows"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { PlanMixItem } from "../../types"

interface PlanMixCardProps {
  items: PlanMixItem[]
  className?: string
}

export function PlanMixCard({ items, className }: PlanMixCardProps) {
  const rows = items.map((item) => ({
    label: item.label,
    value: `${item.percent}% (${item.count.toLocaleString()})`,
    percent: item.percent,
    tone: "primary" as const,
  }))

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground text-lg tracking-tight">
          Plan mix
        </p>
      </CardHeader>
      <CardContent>
        <ProgressRows rows={rows} />
      </CardContent>
    </Card>
  )
}
