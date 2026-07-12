import { cn } from "@workspace/ui/lib/utils"
import { CREATOR_STATUS_BADGE_CLASS } from "../constants"
import type { CreatorStatus } from "../types"

export function CreatorStatusBadge({ status }: { status: CreatorStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
        CREATOR_STATUS_BADGE_CLASS[status]
      )}
    >
      {status}
    </span>
  )
}
