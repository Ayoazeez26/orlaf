import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { AlertTriangle, User } from "lucide-react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { CONTENT_TYPE_LABEL } from "../constants"
import type { ModerationReport } from "../types"
import { ModerationStatusBadge, SeverityBadge } from "./moderation-badges"

interface ModerationTableProps {
  reports: ModerationReport[]
  role: WorkspaceRoleId
}

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

const SEVERITY_ICON_CLASS = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-muted-foreground",
} as const

export function ModerationTable({ reports, role }: ModerationTableProps) {
  if (reports.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No reports match your filters.
      </div>
    )
  }

  return (
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
          {reports.map((report) => {
            const isUser = report.contentType === "user-profile"
            const Icon = isUser ? User : AlertTriangle

            return (
              <tr
                key={report.id}
                className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60",
                        isUser
                          ? "text-muted-foreground"
                          : SEVERITY_ICON_CLASS[report.severity]
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {report.title}
                      </p>
                      <p className="truncate text-muted-foreground text-xs">
                        {CONTENT_TYPE_LABEL[report.contentType]}
                        {report.parent ? ` · ${report.parent}` : ""}
                      </p>
                    </div>
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
                  <Button asChild variant="outline" size="sm">
                    <Link
                      to="/workspace/$role/moderation/$reportId"
                      params={{ role, reportId: report.id }}
                    >
                      Review
                    </Link>
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
