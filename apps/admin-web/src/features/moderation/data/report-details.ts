import type { ModerationReportDetail } from "../types"
import { MOCK_MODERATION_REPORTS } from "./mock-moderation"

const DETAIL_OVERRIDES: Record<string, Partial<ModerationReportDetail>> = {
  "report-1": {
    reporterNote:
      "Inappropriate content. Please review the content at the earliest convenience and confirm whether SABLE TV guidelines have been violated.",
    projectId: "the-returnees",
    creatorId: "adaeze-okafor",
    creatorName: "Adaeze Okafor",
    activity: [
      { id: "opened", label: "Report opened", timestamp: "2 hours ago" },
    ],
  },
  "report-2": {
    reporterNote:
      "Trailer appears to use copyrighted music without clearance. Rights holder contacted us directly.",
    projectId: "the-returnees",
    creatorId: "adaeze-okafor",
    creatorName: "Adaeze Okafor",
    activity: [
      { id: "opened", label: "Report opened", timestamp: "1 day ago" },
      {
        id: "reviewed",
        label: "Marked as reviewed",
        timestamp: "18 hours ago",
      },
    ],
  },
  "report-3": {
    reporterNote:
      "Multiple streamers reported harassment in comments and DMs. Please review account activity.",
    activity: [
      { id: "opened", label: "Report opened", timestamp: "5 hours ago" },
    ],
  },
  "report-4": {
    reporterNote:
      "Thumbnail does not match episode content. Viewer reported misleading clickbait.",
    projectId: "zulu-dawn",
    creatorId: "zulu-dawn-creator",
    creatorName: "Kemi Adeyemi",
    activity: [
      { id: "opened", label: "Report opened", timestamp: "3 days ago" },
      { id: "resolved", label: "Report resolved", timestamp: "2 days ago" },
    ],
  },
  "report-5": {
    reporterNote:
      "Episode comment section flooded with spam links. Needs cleanup and possible rate limiting.",
    projectId: "jollof-wars",
    creatorId: "jollof-wars-creator",
    creatorName: "Tunde Bakare",
    activity: [
      { id: "opened", label: "Report opened", timestamp: "6 hours ago" },
    ],
  },
  "report-6": {
    reporterNote:
      "Unusual login patterns from multiple regions in a short window. Flagged by automated review.",
    activity: [
      { id: "opened", label: "Report opened", timestamp: "2 days ago" },
      { id: "reviewed", label: "Marked as reviewed", timestamp: "1 day ago" },
    ],
  },
}

function buildDetail(
  report: (typeof MOCK_MODERATION_REPORTS)[number]
): ModerationReportDetail {
  const override = DETAIL_OVERRIDES[report.id] ?? {}

  return {
    ...report,
    reporterNote: override.reporterNote ?? "",
    projectId: override.projectId,
    creatorId: override.creatorId,
    creatorName: override.creatorName,
    activity: override.activity ?? [
      { id: "opened", label: "Report opened", timestamp: report.reported },
    ],
  }
}

export function getReportDetail(
  id: string
): ModerationReportDetail | undefined {
  const report = MOCK_MODERATION_REPORTS.find((item) => item.id === id)
  if (!report) return undefined
  return buildDetail(report)
}
