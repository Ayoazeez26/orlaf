import { cn } from "@workspace/ui/lib/utils"
import {
  BUNDLE_STATUS_BADGE_CLASS,
  PURCHASE_STATUS_BADGE_CLASS,
} from "../constants"
import type { CoinBundleStatus, PurchaseStatus } from "../types"

export function BundleStatusBadge({ status }: { status: CoinBundleStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs capitalize",
        BUNDLE_STATUS_BADGE_CLASS[status]
      )}
    >
      {status}
    </span>
  )
}

export function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs capitalize",
        PURCHASE_STATUS_BADGE_CLASS[status]
      )}
    >
      {status}
    </span>
  )
}
