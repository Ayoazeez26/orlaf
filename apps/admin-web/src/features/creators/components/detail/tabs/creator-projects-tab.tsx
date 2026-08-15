import { Link } from "@tanstack/react-router"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { Clapperboard, MoreHorizontal, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { useProjectsQuery } from "@/features/projects/api/projects-hooks"
import { TableRowsSkeleton } from "@/features/workspaces/components/page-skeletons"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { CreatorProjectFilter } from "../../../constants"
import {
  CREATOR_PROJECT_FILTERS,
  PROJECT_STATUS_BADGE_CLASS,
  PROJECT_STATUS_LABEL,
} from "../../../constants"
import { formatCreatorViews } from "../../../data/creator-details"
import { mapAdminSeriesToCreatorProject } from "../../../lib/map-creator-project"
import type { CreatorDetail, CreatorProject } from "../../../types"

function matchesProjectFilter(
  project: CreatorProject,
  filter: CreatorProjectFilter
) {
  if (filter === "all") return true
  return project.status === filter
}

export function CreatorProjectsTab({
  creator,
  role,
}: {
  creator: CreatorDetail
  role: WorkspaceRoleId
}) {
  const [activeFilter, setActiveFilter] = useState<CreatorProjectFilter>("all")
  const [search, setSearch] = useState("")
  const { data, isPending, isError, error } = useProjectsQuery({
    creatorId: creator.id,
    page: 1,
    pageSize: 100,
  })

  const projects = useMemo(
    () => (data?.items ?? []).map(mapAdminSeriesToCreatorProject),
    [data?.items]
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return projects.filter((project) => {
      if (!matchesProjectFilter(project, activeFilter)) return false
      if (query && !project.title.toLowerCase().includes(query)) return false
      return true
    })
  }, [activeFilter, projects, search])

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-5 px-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {CREATOR_PROJECT_FILTERS.map((filter) => {
              const isActive = filter.key === activeFilter

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 font-medium text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>

          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="h-9 w-full pl-9 sm:w-56"
            />
          </div>
        </div>

        {isPending ? <TableRowsSkeleton /> : null}

        {isError ? (
          <p className="py-8 text-center text-destructive text-sm">
            {error instanceof Error
              ? error.message
              : "Could not load projects for this creator."}
          </p>
        ) : null}

        {!isPending && !isError && filtered.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">
            No projects found for this creator.
          </p>
        ) : null}

        {!isPending && !isError && filtered.length > 0 ? (
          <ul className="divide-y divide-border/60">
            {filtered.map((project) => (
              <li
                key={project.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clapperboard className="size-4 text-primary" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/workspace/$role/projects/$projectId"
                    params={{ role, projectId: project.id }}
                    className="font-medium text-foreground text-sm hover:underline"
                  >
                    {project.title}
                  </Link>
                  <p className="text-muted-foreground text-xs">
                    {project.type} · {project.genre} · {project.meta} · Updated{" "}
                    {project.updated}
                  </p>
                </div>
                {project.views ? (
                  <span className="hidden shrink-0 text-muted-foreground text-xs sm:block">
                    {formatCreatorViews(project.views)} views
                  </span>
                ) : null}
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 font-medium text-xs",
                    PROJECT_STATUS_BADGE_CLASS[project.status]
                  )}
                >
                  {PROJECT_STATUS_LABEL[project.status]}
                </span>
                <button
                  type="button"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="More actions"
                >
                  <MoreHorizontal className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  )
}
