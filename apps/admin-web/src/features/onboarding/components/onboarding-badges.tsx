import { cn } from "@workspace/ui/lib/utils"
import {
  APPLICATION_STATUS_BADGE_CLASS,
  INVITE_STATUS_BADGE_CLASS,
} from "../constants"
import type { ApplicationStatus, InviteStatus } from "../types"

export function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs capitalize",
        APPLICATION_STATUS_BADGE_CLASS[status]
      )}
    >
      {status}
    </span>
  )
}

export function InviteStatusBadge({ status }: { status: InviteStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs capitalize",
        INVITE_STATUS_BADGE_CLASS[status]
      )}
    >
      {status}
    </span>
  )
}
