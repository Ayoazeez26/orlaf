import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { ReportDetailPage } from "@/features/moderation/components/detail/report-detail-page"
import { getReportDetail } from "@/features/moderation/data/report-details"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/moderation/$reportId")({
  component: WorkspaceReportDetail,
})

function WorkspaceReportDetail() {
  const { role, reportId } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="moderation">
      <ReportDetailContent role={workspaceRole} reportId={reportId} />
    </WorkspaceSectionGate>
  )
}

function ReportDetailContent({
  role,
  reportId,
}: {
  role: WorkspaceRoleId
  reportId: string
}) {
  const report = getReportDetail(reportId)

  if (!report) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <Link
          to="/workspace/$role/moderation"
          params={{ role }}
          className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Moderation
        </Link>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t find that report.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ReportDetailPage report={report} role={role} />
    </div>
  )
}
