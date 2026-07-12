import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowLeft, Check, Clapperboard, EyeOff, Trash2, X } from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { projectSubtitle } from "../../data/project-details"
import type { ProjectDetail } from "../../types"
import { PublishStatusBadge, ReviewStatusBadge } from "../project-badges"
import { ProjectApproveDialog } from "./project-approve-dialog"
import { ProjectDeleteDialog } from "./project-delete-dialog"
import { ProjectRejectDialog } from "./project-reject-dialog"

interface ProjectDetailHeaderProps {
  project: ProjectDetail
  role: WorkspaceRoleId
  variant?: "detail" | "review"
}

export function ProjectDetailHeader({
  project,
  role,
  variant = "detail",
}: ProjectDetailHeaderProps) {
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const isReview = variant === "review" || project.reviewStatus === "pending"

  return (
    <div className="space-y-4">
      <Link
        to="/workspace/$role/projects"
        params={{ role }}
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Projects
      </Link>

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-5")}>
        <CardContent className="flex flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Clapperboard className="size-7 text-primary" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-semibold text-foreground text-xl tracking-tight">
                  {project.title}
                </h1>
                {isReview ? (
                  <ReviewStatusBadge status="pending" />
                ) : (
                  <PublishStatusBadge status={project.publishStatus} />
                )}
              </div>
              <p className="truncate text-muted-foreground text-sm">
                {projectSubtitle(project)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {isReview ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 border-red-500/30 text-red-600 hover:bg-red-500/5"
                  onClick={() => setRejectOpen(true)}
                >
                  <X className="size-4" aria-hidden />
                  Reject
                </Button>
                <Button
                  type="button"
                  className="gap-2"
                  onClick={() => setApproveOpen(true)}
                >
                  <Check className="size-4" aria-hidden />
                  Approve
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" className="gap-2">
                  <EyeOff className="size-4" aria-hidden />
                  Unpublish
                </Button>
                <Button
                  type="button"
                  className="gap-2 bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-4" aria-hidden />
                  Delete
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <ProjectApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        projectTitle={project.title}
        creatorName={project.creatorName}
        creatorUsername={project.creatorUsername}
      />

      <ProjectRejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        projectTitle={project.title}
        creatorName={project.creatorName}
        creatorUsername={project.creatorUsername}
      />

      <ProjectDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        projectTitle={project.title}
        creatorName={project.creatorName}
        creatorUsername={project.creatorUsername}
      />
    </div>
  )
}
