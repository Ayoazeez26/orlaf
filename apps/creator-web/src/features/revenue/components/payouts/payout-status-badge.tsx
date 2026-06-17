import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { Check } from "lucide-react"
import type { PayoutStatus } from "../../types"

const STATUS_LABELS: Record<PayoutStatus, string> = {
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
}

interface PayoutStatusBadgeProps {
  status: PayoutStatus
  className?: string
}

export function PayoutStatusBadge({
  status,
  className,
}: PayoutStatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "gap-1 border-0 font-normal",
        status === "completed" &&
          "bg-payout-accent-muted text-primary hover:bg-payout-accent-muted",
        status === "pending" &&
          "bg-trend-positive-muted text-trend-positive hover:bg-trend-positive-muted",
        status === "failed" &&
          "bg-trend-negative-muted text-trend-negative hover:bg-trend-negative-muted",
        className
      )}
    >
      {status === "completed" && <Check className="size-3" aria-hidden />}
      {STATUS_LABELS[status]}
    </Badge>
  )
}
