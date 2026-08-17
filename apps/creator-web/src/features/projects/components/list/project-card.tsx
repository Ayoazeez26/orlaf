import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useState } from "react"
import { ConfirmDeleteDialog } from "@/features/settings/components/confirm-delete-dialog"
import { toast, toastMutationError } from "@/lib/toast"
import { projectDetailPath } from "../../constants"
import { useDeleteProject } from "../../hooks/use-project"
import type { ProjectSummary } from "../../types"
import { ProjectListThumbnail } from "../shared/project-list-thumbnail"
import { ProjectStatusBadge } from "../shared/project-status-badge"

interface ProjectCardProps {
  project: ProjectSummary
}

function buildMetaLine(project: ProjectSummary) {
  const parts = [project.type]

  if (project.genre) parts.push(project.genre)

  if (project.episodeCount !== undefined) {
    parts.push(`${project.episodeCount} eps`)
  } else if (project.duration) {
    parts.push(project.duration)
  }

  parts.push(`Updated ${project.updatedAt}`)

  return parts.join(" · ")
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteProject = useDeleteProject(project.id)

  return (
    <article className="group flex w-full flex-col rounded-[20px] border border-[#E2E4EB] bg-[#F9FAFE] p-3">
      <Link
        {...projectDetailPath(project.id)}
        className="relative block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ProjectListThumbnail
          variant={project.iconVariant}
          className="aspect-[3/4] h-auto w-full rounded-2xl"
          iconClassName="size-8"
        />
        <ProjectStatusBadge
          status={project.status}
          variant="overlay"
          className="absolute top-3 left-3"
        />
      </Link>
      <div className="mt-4 min-w-0 flex-1">
        <Link
          {...projectDetailPath(project.id)}
          className="block truncate font-bold text-foreground transition-colors group-hover:text-primary"
        >
          {project.title}
        </Link>
        <p className="mt-1 text-muted-foreground text-sm">
          {buildMetaLine(project)}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between border-border border-t pt-3">
        <span className="text-muted-foreground text-sm">
          {project.views ?? "—"}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <MoreVertical className="size-4" aria-hidden />
              <span className="sr-only">Project actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link {...projectDetailPath(project.id, "settings")}>
                Edit series
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setDeleteOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!deleteProject.isPending) setDeleteOpen(open)
        }}
        title="Delete project?"
        description={`Permanently delete “${project.title}”? This cannot be undone.`}
        isPending={deleteProject.isPending}
        onConfirm={async () => {
          try {
            await deleteProject.mutateAsync()
            toast.success("Project deleted.")
            setDeleteOpen(false)
          } catch (error) {
            toastMutationError(error, "Failed to delete project")
          }
        }}
      />
    </article>
  )
}
