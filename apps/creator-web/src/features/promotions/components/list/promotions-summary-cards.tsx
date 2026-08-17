import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { DollarSign, Eye, LineChart, Megaphone } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { PromotionsSummaryKpi } from "../../types"

const KPI_ICONS: Record<string, typeof Megaphone> = {
  Active: Megaphone,
  "Total Spend": DollarSign,
  Impressions: Eye,
  "Avg. CTR": LineChart,
}

interface PromotionsSummaryCardsProps {
  kpis: PromotionsSummaryKpi[]
  className?: string
}

export function PromotionsSummaryCards({
  kpis,
  className,
}: PromotionsSummaryCardsProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {kpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.label] ?? Megaphone

        return (
          <Card
            key={kpi.label}
            className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}
          >
            <CardContent className="flex flex-col gap-4 p-0 px-6">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  {kpi.label}
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon
                    className="size-5 text-primary"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              </div>
              <p className="font-bold font-space-grotesk text-2xl text-foreground tracking-tight">
                {kpi.value}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
