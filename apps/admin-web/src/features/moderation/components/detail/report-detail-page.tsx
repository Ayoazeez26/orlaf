import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { ModerationReportDetail } from "../../types"
import { ReportActivityCard } from "./report-activity-card"
import { ReportDetailHeader } from "./report-detail-header"
import { ReportResolveCard } from "./report-resolve-card"
import { ReportSummaryCard } from "./report-summary-card"

interface ReportDetailPageProps {
  report: ModerationReportDetail
  role: WorkspaceRoleId
}

export function ReportDetailPage({ report, role }: ReportDetailPageProps) {
  return (
    <div className="space-y-6">
      <ReportDetailHeader report={report} role={role} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReportSummaryCard report={report} role={role} />
        </div>
        <ReportResolveCard report={report} />
      </div>

      <ReportActivityCard report={report} />
    </div>
  )
}
