import type {
  ModerationReportReason,
  ModerationTargetType,
} from "./admin-moderation"

/** Reasons a viewer can pick when reporting content or a user. */
export const REPORT_REASONS: ModerationReportReason[] = [
  "copyright",
  "nudity",
  "impersonation",
  "scam",
  "bullying",
  "harassment",
]

export interface CreateReportRequest {
  targetType: ModerationTargetType
  targetId: string
  reason: ModerationReportReason
  note?: string
}

export interface CreateReportResponse {
  id: string
}
