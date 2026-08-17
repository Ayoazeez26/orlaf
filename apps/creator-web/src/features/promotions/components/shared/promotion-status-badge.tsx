import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import type { PromotionStatus } from "../../types"

const STATUS_STYLES: Record<
  PromotionStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "border-transparent bg-emerald-500/15 text-emerald-600",
  },
  paused: {
    label: "Paused",
    className: "border-transparent bg-amber-500/15 text-amber-700",
  },
  pending: {
    label: "Pending",
    className: "border-transparent bg-sky-500/15 text-sky-700",
  },
  completed: {
    label: "Completed",
    className: "border-transparent bg-muted text-muted-foreground",
  },
  rejected: {
    label: "Rejected",
    className: "border-transparent bg-destructive/15 text-destructive",
  },
  draft: {
    label: "Draft",
    className: "border-transparent bg-primary/15 text-primary",
  },
  archived: {
    label: "Archived",
    className: "border-transparent bg-muted text-muted-foreground",
  },
}

interface PromotionStatusBadgeProps {
  status: PromotionStatus
  className?: string
}

export function PromotionStatusBadge({
  status,
  className,
}: PromotionStatusBadgeProps) {
  const config = STATUS_STYLES[status]

  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 px-2.5 py-0.5 font-medium text-xs",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
