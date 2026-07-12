import { cn } from "@workspace/ui/lib/utils"
import {
  PROMOTION_STATUS_BADGE_CLASS,
  PROMOTION_STATUS_LABEL,
} from "../constants"
import type { PromotionStatus } from "../types"

export function PromotionStatusBadge({ status }: { status: PromotionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
        PROMOTION_STATUS_BADGE_CLASS[status]
      )}
    >
      {PROMOTION_STATUS_LABEL[status]}
    </span>
  )
}
