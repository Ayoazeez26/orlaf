import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import {
  DollarSign,
  Eye,
  Megaphone,
  MousePointerClick,
  Pause,
  Pencil,
} from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"

const METRIC_ICONS = {
  dollar: DollarSign,
  megaphone: Megaphone,
  eye: Eye,
  cursor: MousePointerClick,
} as const

interface PromotionMetricCardsProps {
  budget: number
  spent: number
  impressions: string
  ctr: string
  className?: string
}

export function PromotionMetricCards({
  budget,
  spent,
  impressions,
  ctr,
  className,
}: PromotionMetricCardsProps) {
  const metrics = [
    { label: "Budget", value: `$${budget}`, icon: "dollar" as const },
    { label: "Spent", value: `$${spent}`, icon: "megaphone" as const },
    { label: "Impressions", value: impressions, icon: "eye" as const },
    { label: "CTR", value: ctr, icon: "cursor" as const },
  ]

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {metrics.map((metric) => {
        const Icon = METRIC_ICONS[metric.icon]

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
              <p className="font-bold font-space-grotesk text-2xl text-foreground tracking-tight">
                {metric.value}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

interface PromotionActionsCardProps {
  onEdit: () => void
  className?: string
}

export function PromotionActionsCard({
  onEdit,
  className,
}: PromotionActionsCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="space-y-1 pb-4">
        <p className="font-semibold text-foreground">Actions</p>
        <p className="text-muted-foreground text-sm">Manage this promotion</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onEdit}
        >
          <Pencil className="size-4" aria-hidden />
          Edit promotion
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <Pause className="size-4" aria-hidden />
          Pause
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
        >
          End promotion
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="w-full justify-start"
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  )
}
