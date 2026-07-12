import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { ModerationReportDetail } from "../../types"
import { ModerationStatusBadge, SeverityBadge } from "../moderation-badges"

interface ReportDetailHeaderProps {
  report: ModerationReportDetail
  role: WorkspaceRoleId
}

export function ReportDetailHeader({ report, role }: ReportDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <Link
        to="/workspace/$role/moderation"
        params={{ role }}
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Moderation
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
            Report on {report.title}
          </h1>
          {report.parent ? (
            <p className="text-muted-foreground text-sm">{report.parent}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <SeverityBadge severity={report.severity} />
          <ModerationStatusBadge status={report.status} />
        </div>
      </div>
    </div>
  )
}
