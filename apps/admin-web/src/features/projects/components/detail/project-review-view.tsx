import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  Clapperboard,
  Clock,
  Flag,
  Globe,
  ImageIcon,
  ShieldCheck,
  Tag,
} from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { ProjectDetail } from "../../types"
import { ReviewStatusBadge } from "../project-badges"
import { ModerateThumbnailDialog } from "./moderate-thumbnail-dialog"
import { ProjectModerationActionDialog } from "./project-moderation-action-dialog"
import { ProjectEpisodesTab } from "./tabs/project-episodes-tab"

interface InfoField {
  icon: LucideIcon
  label: string
  value: string
}

function InfoFieldRow({ icon: Icon, label, value }: InfoField) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </span>
      <div className="min-w-0 space-y-0.5">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-medium text-foreground text-sm">{value}</p>
      </div>
    </div>
  )
}

interface ProjectReviewViewProps {
  project: ProjectDetail
  role: WorkspaceRoleId
}

export function ProjectReviewView({ project, role }: ProjectReviewViewProps) {
  const [thumbnailOpen, setThumbnailOpen] = useState(false)
  const [moderationOpen, setModerationOpen] = useState(false)

  const fields: InfoField[] = [
    { icon: Tag, label: "Genre", value: project.genre },
    { icon: Globe, label: "Language", value: project.language },
    { icon: Calendar, label: "Created", value: project.created },
    {
      icon: Clapperboard,
      label: "Episodes",
      value: String(project.episodeCount),
    },
  ]

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <Clock
            className="mt-0.5 size-5 shrink-0 text-amber-600"
            aria-hidden
          />
          <p className="text-foreground text-sm">
            This series is awaiting review. Verify episodes, thumbnail,
            metadata, and guidelines compliance before publishing.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
            <CardContent className="space-y-6 px-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-foreground text-lg tracking-tight">
                  About
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setModerationOpen(true)}
                >
                  <ShieldCheck className="size-4" aria-hidden />
                  Moderation action
                </Button>
              </div>
              <p className="text-foreground text-sm leading-relaxed">
                {project.description}
              </p>

              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <InfoFieldRow key={field.label} {...field} />
                ))}
              </div>

              <div className="space-y-3 border-border border-t pt-5">
                <h3 className="font-semibold text-foreground text-sm">
                  Creator
                </h3>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-medium text-primary text-sm">
                    {project.creatorInitials}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {project.creatorName}
                    </p>
                    <p className="truncate text-muted-foreground text-xs">
                      {project.creatorEmail}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
            <CardContent className="space-y-5 px-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-foreground text-lg tracking-tight">
                  Thumbnail
                </h2>
                <ReviewStatusBadge status="pending" />
              </div>

              <div className="flex aspect-video items-center justify-center rounded-xl border border-border bg-muted/40">
                <ImageIcon
                  className="size-10 text-muted-foreground/50"
                  aria-hidden
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => setThumbnailOpen(true)}
              >
                <Flag className="size-4" aria-hidden />
                Flag thumbnail
              </Button>
            </CardContent>
          </Card>
        </div>

        <ProjectEpisodesTab project={project} />
      </div>

      <ModerateThumbnailDialog
        open={thumbnailOpen}
        onOpenChange={setThumbnailOpen}
        projectTitle={project.title}
      />

      <ProjectModerationActionDialog
        open={moderationOpen}
        onOpenChange={setModerationOpen}
        projectTitle={project.title}
        projectSubtitle={project.genre}
        projectId={project.id}
        role={role}
      />
    </>
  )
}
