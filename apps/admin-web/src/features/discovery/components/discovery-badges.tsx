import { cn } from "@workspace/ui/lib/utils"
import { RAIL_STATUS_BADGE_CLASS, RAIL_STATUS_LABEL } from "../constants"
import type { RailStatus } from "../types"

export function RailStatusBadge({ status }: { status: RailStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
        RAIL_STATUS_BADGE_CLASS[status]
      )}
    >
      {RAIL_STATUS_LABEL[status]}
    </span>
  )
}

export function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 font-medium text-[11px] text-muted-foreground">
      Coming soon
    </span>
  )
}

export function HeroBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
      Hero
    </span>
  )
}
