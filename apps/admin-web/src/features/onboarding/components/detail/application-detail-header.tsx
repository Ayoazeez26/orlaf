import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowLeft, Check, X } from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { ApplicationDetail } from "../../types"
import { ApplicationStatusBadge } from "../onboarding-badges"
import { ApplicationApproveDialog } from "./application-approve-dialog"
import { ApplicationRejectDialog } from "./application-reject-dialog"

interface ApplicationDetailHeaderProps {
  application: ApplicationDetail
  role: WorkspaceRoleId
}

export function ApplicationDetailHeader({
  application,
  role,
}: ApplicationDetailHeaderProps) {
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const isPending = application.status === "pending"

  return (
    <div className="space-y-4">
      <Link
        to="/workspace/$role/onboarding"
        params={{ role }}
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Onboarding
      </Link>

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-5")}>
        <CardContent className="flex flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 shrink-0">
              <AvatarFallback className="bg-primary/15 font-semibold text-lg text-primary">
                {application.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-semibold text-foreground text-xl tracking-tight">
                  {application.name}
                </h1>
                <ApplicationStatusBadge status={application.status} />
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
                  Applicant
                </span>
              </div>
              <p className="truncate text-muted-foreground text-sm">
                {application.email} · {application.username}
              </p>
            </div>
          </div>

          {isPending ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5"
                onClick={() => setApproveOpen(true)}
              >
                <Check className="size-4" aria-hidden />
                Approve
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2 border-red-500/30 text-red-600 hover:bg-red-500/5"
                onClick={() => setRejectOpen(true)}
              >
                <X className="size-4" aria-hidden />
                Reject
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <ApplicationApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        applicantName={application.name}
        applicantEmail={application.email}
        applicantUsername={application.username}
      />

      <ApplicationRejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        applicantName={application.name}
        applicantEmail={application.email}
        applicantUsername={application.username}
      />
    </div>
  )
}
