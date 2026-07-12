import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "../../lib/frosted-card"
import type { MetricDef } from "../../types"

interface MetricCardsRowProps {
  metrics: MetricDef[]
}

export function MetricCardsRow({ metrics }: MetricCardsRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <Card
            key={metric.label}
            className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}
          >
            <CardContent className="flex flex-col gap-4 p-0 px-6">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  {metric.label}
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon
                    className="size-5 text-primary"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              </div>

              <p className="font-bold text-2xl text-foreground tracking-tight">
                {metric.value}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
