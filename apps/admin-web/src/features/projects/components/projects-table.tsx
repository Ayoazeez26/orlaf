import { useNavigate } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Clapperboard, X } from "lucide-react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { usePublishProject, useRejectProject } from "../api/projects-hooks"
import { formatProjectViews } from "../data/project-details"
import type { Project } from "../types"
import { PublishStatusBadge, ReviewStatusBadge } from "./project-badges"

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

interface ProjectsTableProps {
  projects: Project[]
  role: WorkspaceRoleId
  isRefreshing?: boolean
}

export function ProjectsTable({
  projects,
  role,
  isRefreshing = false,
}: ProjectsTableProps) {
  const navigate = useNavigate()

  function openDetail(projectId: string) {
    navigate({
      to: "/workspace/$role/projects/$projectId",
      params: { role, projectId },
    })
  }

  if (projects.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No series match your filters.
      </div>
    )
  }

  return (
    <div
      className={cn(
        "overflow-x-auto",
        isRefreshing && "opacity-70 transition-opacity"
      )}
    >
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={HEAD_CLASS}>Series</th>
            <th className={HEAD_CLASS}>Creator</th>
            <th className={HEAD_CLASS}>Episodes</th>
            <th className={HEAD_CLASS}>Views</th>
            <th className={HEAD_CLASS}>Status</th>
            <th className={HEAD_CLASS}>Review</th>
            <th className={HEAD_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              onClick={() => openDetail(project.id)}
              className="cursor-pointer border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                    )}
                  >
                    <Clapperboard className="size-4 text-primary" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {project.title}
                    </p>
                    <p className="truncate text-muted-foreground text-xs">
                      {project.genre} • {project.language}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {project.creatorName}
              </td>
              <td className="px-4 py-3 text-muted-foreground tabular-nums">
                {project.episodeCount}
                {project.pendingEpisodeCount > 0 ? (
                  <span className="ml-1 text-amber-600">
                    · {project.pendingEpisodeCount} pending
                  </span>
                ) : null}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground tabular-nums">
                {formatProjectViews(project.views)}
              </td>
              <td className="px-4 py-3">
                <PublishStatusBadge status={project.publishStatus} />
              </td>
              <td className="px-4 py-3">
                <ReviewStatusBadge status={project.reviewStatus} />
              </td>
              <td
                className="px-4 py-3"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <ProjectRowActions
                  project={project}
                  onOpenDetail={() => openDetail(project.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProjectRowActions({
  project,
  onOpenDetail,
}: {
  project: Project
  onOpenDetail: () => void
}) {
  const publish = usePublishProject(project.id)
  const reject = useRejectProject(project.id)
  const isPending = publish.isPending || reject.isPending

  if (
    project.reviewStatus === "pending" &&
    project.publishStatus !== "published"
  ) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          className="gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5"
          onClick={() => publish.mutate(undefined)}
        >
          <Check className="size-3.5" aria-hidden />
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          className="gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/5"
          onClick={() => reject.mutate(undefined)}
        >
          <X className="size-3.5" aria-hidden />
          Reject
        </Button>
      </div>
    )
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={onOpenDetail}>
      Review
    </Button>
  )
}
