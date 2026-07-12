import { cn } from "@workspace/ui/lib/utils"
import {
  MODERATION_STATUS_BADGE_CLASS,
  SEVERITY_BADGE_CLASS,
} from "../constants"
import type { ModerationReportStatus, ModerationSeverity } from "../types"

export function SeverityBadge({ severity }: { severity: ModerationSeverity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs capitalize",
        SEVERITY_BADGE_CLASS[severity]
      )}
    >
      {severity}
    </span>
  )
}

export function ModerationStatusBadge({
  status,
}: {
  status: ModerationReportStatus
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs capitalize",
        MODERATION_STATUS_BADGE_CLASS[status]
      )}
    >
      {status}
    </span>
  )
}
