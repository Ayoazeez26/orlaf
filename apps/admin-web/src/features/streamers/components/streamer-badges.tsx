import { cn } from "@workspace/ui/lib/utils"
import { PLAN_BADGE_CLASS, STATUS_BADGE_CLASS } from "../constants"
import type { StreamerPlan, StreamerStatus } from "../types"

export function PlanBadge({ plan }: { plan: StreamerPlan }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
        PLAN_BADGE_CLASS[plan]
      )}
    >
      {plan}
    </span>
  )
}

export function StatusBadge({ status }: { status: StreamerStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
        STATUS_BADGE_CLASS[status]
      )}
    >
      {status}
    </span>
  )
}
