import { cn } from "@workspace/ui/lib/utils"
import { Check, Clock, X } from "lucide-react"
import {
  MODERATION_STATUS_BADGE_CLASS,
  PUBLISH_STATUS_BADGE_CLASS,
  PUBLISH_STATUS_LABEL,
  REVIEW_STATUS_BADGE_CLASS,
  REVIEW_STATUS_LABEL,
  SEVERITY_BADGE_CLASS,
} from "../constants"
import type {
  ModerationReportStatus,
  ModerationSeverity,
  ProjectPublishStatus,
  ProjectReviewStatus,
} from "../types"

export function PublishStatusBadge({
  status,
}: {
  status: ProjectPublishStatus
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs capitalize",
        PUBLISH_STATUS_BADGE_CLASS[status]
      )}
    >
      {PUBLISH_STATUS_LABEL[status]}
    </span>
  )
}

export function ReviewStatusBadge({ status }: { status: ProjectReviewStatus }) {
  const Icon = status === "approved" ? Check : status === "pending" ? Clock : X

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium text-xs",
        REVIEW_STATUS_BADGE_CLASS[status]
      )}
    >
      <Icon className="size-3" aria-hidden />
      {REVIEW_STATUS_LABEL[status]}
    </span>
  )
}

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
