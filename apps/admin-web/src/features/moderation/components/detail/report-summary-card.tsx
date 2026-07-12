import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Flag, FolderOpen } from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { CONTENT_TYPE_LABEL } from "../../constants"
import type { ModerationReportDetail } from "../../types"
import { ReportModerationActionDialog } from "./report-moderation-action-dialog"

interface ReportSummaryCardProps {
  report: ModerationReportDetail
  role: WorkspaceRoleId
}

export function ReportSummaryCard({ report, role }: ReportSummaryCardProps) {
  const [actionOpen, setActionOpen] = useState(false)

  const fields = [
    { label: "Reason", value: report.reason },
    {
      label: "Severity",
      value: report.severity.charAt(0).toUpperCase() + report.severity.slice(1),
    },
    {
      label: "Type",
      value: report.reportType === "user" ? "User" : "Content",
    },
    { label: "Content", value: report.title },
    ...(report.parent ? [{ label: "Parent", value: report.parent }] : []),
  ]

  return (
    <>
      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardHeader className="px-5 pb-4 sm:px-6">
          <CardTitle className="font-semibold text-base">
            Report summary
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Reported {report.reported}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 px-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <div key={field.label} className="space-y-1">
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  {field.label}
                </p>
                <p className="font-medium text-foreground text-sm">
                  {field.value}
                </p>
              </div>
            ))}

            {report.creatorName ? (
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Creator
                </p>
                {report.creatorId ? (
                  <Link
                    to="/workspace/$role/creators/$creatorId"
                    params={{ role, creatorId: report.creatorId }}
                    className="font-medium text-primary text-sm hover:underline"
                  >
                    {report.creatorName}
                  </Link>
                ) : (
                  <p className="font-medium text-foreground text-sm">
                    {report.creatorName}
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {report.reporterNote ? (
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Reporter note
              </p>
              <blockquote className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-muted-foreground text-sm italic leading-relaxed">
                &ldquo;{report.reporterNote}&rdquo;
              </blockquote>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            {report.projectId ? (
              <Button asChild type="button" variant="outline" className="gap-2">
                <Link
                  to="/workspace/$role/projects/$projectId"
                  params={{ role, projectId: report.projectId }}
                >
                  <FolderOpen className="size-4" aria-hidden />
                  Open project
                </Link>
              </Button>
            ) : null}
            <Button
              type="button"
              className="gap-2"
              onClick={() => setActionOpen(true)}
            >
              <Flag className="size-4" aria-hidden />
              Take moderation action
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReportModerationActionDialog
        open={actionOpen}
        onOpenChange={setActionOpen}
        reportTitle={report.title}
        contentType={CONTENT_TYPE_LABEL[report.contentType]}
      />
    </>
  )
}
