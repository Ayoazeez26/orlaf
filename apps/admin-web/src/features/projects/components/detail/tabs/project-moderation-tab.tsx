import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { AlertTriangle, ArrowUpRight } from "lucide-react"
import { useModerationReportsQuery } from "@/features/moderation/api/moderation-hooks"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { ProjectDetail } from "../../../types"
import { ModerationStatusBadge, SeverityBadge } from "../../project-badges"

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

const SEVERITY_ICON_CLASS = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-muted-foreground",
} as const

interface ProjectModerationTabProps {
  project: ProjectDetail
  role: WorkspaceRoleId
}

export function ProjectModerationTab({
  project,
  role,
}: ProjectModerationTabProps) {
  const { data, isLoading } = useModerationReportsQuery({
    seriesId: project.id,
    page: 1,
    pageSize: 50,
  })
  const reports = data?.items ?? []

  if (isLoading) {
    return (
      <p className="py-10 text-center text-muted-foreground text-sm">
        Loading reports…
      </p>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-[16px] border bg-surface-frosted p-6 text-center text-muted-foreground text-sm backdrop-blur-[24px]">
        No moderation reports for this project.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[16px] border bg-surface-frosted backdrop-blur-[24px]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className={HEAD_CLASS}>Content</th>
              <th className={HEAD_CLASS}>Severity</th>
              <th className={HEAD_CLASS}>Reason</th>
              <th className={HEAD_CLASS}>Status</th>
              <th className={HEAD_CLASS}>Reported</th>
              <th className={HEAD_CLASS}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={cn(
                        "size-4 shrink-0",
                        SEVERITY_ICON_CLASS[report.severity]
                      )}
                      aria-hidden
                    />
                    <span className="font-medium text-foreground">
                      {report.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={report.severity} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {report.reason}
                </td>
                <td className="px-4 py-3">
                  <ModerationStatusBadge status={report.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {report.reported}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button type="button" variant="ghost" size="sm" asChild>
                    <Link
                      to="/workspace/$role/moderation/$reportId"
                      params={{ role, reportId: report.id }}
                    >
                      Open
                      <ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
