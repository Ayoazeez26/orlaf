import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import {
  DollarSign,
  Eye,
  Loader2,
  Megaphone,
  MousePointerClick,
  Pause,
  Pencil,
  Play,
  Square,
  Trash2,
} from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { PromotionStatus } from "../../types"

const METRIC_ICONS = {
  dollar: DollarSign,
  megaphone: Megaphone,
  eye: Eye,
  cursor: MousePointerClick,
} as const

interface PromotionMetricCardsProps {
  budget: number
  spent: number
  impressionsLabel: string
  ctr: string
  className?: string
}

export function PromotionMetricCards({
  budget,
  spent,
  impressionsLabel,
  ctr,
  className,
}: PromotionMetricCardsProps) {
  const metrics = [
    { label: "Budget", value: `$${budget}`, icon: "dollar" as const },
    { label: "Spent", value: `$${spent}`, icon: "megaphone" as const },
    { label: "Impressions", value: impressionsLabel, icon: "eye" as const },
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
  status: PromotionStatus
  onEdit: () => void
  onPause: () => void
  onResume: () => void
  onEnd: () => void
  onDelete: () => void
  isPending?: boolean
  className?: string
}

export function PromotionActionsCard({
  status,
  onEdit,
  onPause,
  onResume,
  onEnd,
  onDelete,
  isPending = false,
  className,
}: PromotionActionsCardProps) {
  const canEdit = status === "draft" || status === "rejected"
  const canPause = status === "active"
  const canResume = status === "paused"
  const canEnd = status === "active" || status === "paused"
  const canDelete = status === "draft" || status === "completed"

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="space-y-1 pb-4">
        <p className="font-semibold text-foreground">Actions</p>
        <p className="text-muted-foreground text-sm">Manage this promotion</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {canEdit ? (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
            disabled={isPending}
            onClick={onEdit}
          >
            <Pencil className="size-4" aria-hidden />
            Edit promotion
          </Button>
        ) : null}
        {canPause ? (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
            disabled={isPending}
            onClick={onPause}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Pause className="size-4" aria-hidden />
            )}
            Pause
          </Button>
        ) : null}
        {canResume ? (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
            disabled={isPending}
            onClick={onResume}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Play className="size-4" aria-hidden />
            )}
            Resume
          </Button>
        ) : null}
        {canEnd ? (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
            disabled={isPending}
            onClick={onEnd}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Square className="size-4" aria-hidden />
            )}
            End promotion
          </Button>
        ) : null}
        {canDelete ? (
          <Button
            type="button"
            variant="destructive"
            className="w-full justify-start gap-2"
            disabled={isPending}
            onClick={onDelete}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Trash2 className="size-4" aria-hidden />
            )}
            Delete
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
