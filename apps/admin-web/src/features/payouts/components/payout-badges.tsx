import { cn } from "@workspace/ui/lib/utils"
import { PAYOUT_STATUS_BADGE_CLASS, PAYOUT_STATUS_LABEL } from "../constants"
import type { PayoutStatus } from "../types"

export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs capitalize",
        PAYOUT_STATUS_BADGE_CLASS[status]
      )}
    >
      {PAYOUT_STATUS_LABEL[status]}
    </span>
  )
}
