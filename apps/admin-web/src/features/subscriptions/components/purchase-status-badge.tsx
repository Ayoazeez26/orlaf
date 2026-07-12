import { cn } from "@workspace/ui/lib/utils"
import {
  PURCHASE_STATUS_BADGE_CLASS,
  PURCHASE_STATUS_LABEL,
} from "../constants"
import type { PurchaseStatus } from "../types"

export function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
        PURCHASE_STATUS_BADGE_CLASS[status]
      )}
    >
      {PURCHASE_STATUS_LABEL[status]}
    </span>
  )
}
