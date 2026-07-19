import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { EMPTY_PROJECT_STATS, useProjectsQuery } from "../api/projects-hooks"
import type { ProjectFilter } from "../constants"
import { mapListItemToProject } from "../lib/map-project"
import { ProjectsPageHeader } from "./projects-page-header"
import { ProjectsStatCards } from "./projects-stat-cards"
import { ProjectsTable } from "./projects-table"
import { ProjectsToolbar } from "./projects-toolbar"

export function ProjectsPage({ role }: { role: WorkspaceRoleId }) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all")
  const [search, setSearch] = useState("")

  const { data, isPending, isError, error, refetch, isFetching } =
    useProjectsQuery({ filter: activeFilter, q: search })

  const projects = useMemo(
    () => (data?.items ?? []).map(mapListItemToProject),
    [data?.items]
  )
  const stats = data?.stats ?? EMPTY_PROJECT_STATS

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <ProjectsPageHeader />

      <ProjectsStatCards stats={stats} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <ProjectsToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
          />

          {isError ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-muted-foreground text-sm">
                {error instanceof Error
                  ? error.message
                  : "Failed to load projects."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-primary text-sm underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          ) : isPending ? (
            <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
              Loading projects…
            </div>
          ) : (
            <ProjectsTable
              projects={projects}
              role={role}
              isRefreshing={isFetching}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
