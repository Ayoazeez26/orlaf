import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { ProjectCard } from "../components/list/project-card"
import { ProjectListRow } from "../components/list/project-list-row"
import { ProjectsEmptyState } from "../components/list/projects-empty-state"
import {
  ProjectsListCardToolbar,
  ProjectsListSkeleton,
} from "../components/list/projects-list-toolbar"
import { FROSTED_CARD_SURFACE_CLASS } from "../constants/frosted-card"
import { useProjectsList } from "../hooks/use-projects-list"
import {
  DEFAULT_PROJECTS_LIST_FILTERS,
  filterProjects,
} from "../lib/filter-projects"

export function ProjectsListPage() {
  const { data: projects, isLoading, isError } = useProjectsList()
  const [layout, setLayout] = useState<"grid" | "list">("list")
  const [filters, setFilters] = useState(DEFAULT_PROJECTS_LIST_FILTERS)

  const filteredProjects = useMemo(
    () => (projects ? filterProjects(projects, filters) : []),
    [projects, filters]
  )

  const hasProjects = Boolean(projects && projects.length > 0)
  const showEmptyList = projects && projects.length === 0
  const showEmptyResults = hasProjects && filteredProjects.length === 0

  function updateFilters(patch: Partial<typeof filters>) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  function clearFilters() {
    setFilters(DEFAULT_PROJECTS_LIST_FILTERS)
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
            Projects
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Track performance across all your series
          </p>
        </div>
        <Button asChild className="shrink-0 gap-2">
          <Link to="/dashboard/projects/new" search={{ step: "info" }}>
            <Plus className="size-4" aria-hidden />
            New Project
          </Link>
        </Button>
      </div>

      {isLoading && <ProjectsListSkeleton />}

      {isError && (
        <p className="text-destructive text-sm">
          Could not load projects. Please try again.
        </p>
      )}

      {showEmptyList && <ProjectsEmptyState variant="no-projects" />}

      {hasProjects && layout === "list" && (
        <div className={`overflow-hidden ${FROSTED_CARD_SURFACE_CLASS}`}>
          <ProjectsListCardToolbar
            layout={layout}
            onLayoutChange={setLayout}
            filters={filters}
            onFiltersChange={updateFilters}
          />
          {showEmptyResults ? (
            <ProjectsEmptyState
              embedded
              variant="no-results"
              onClearFilters={clearFilters}
            />
          ) : (
            <div>
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={index > 0 ? "border-border border-t" : undefined}
                >
                  <ProjectListRow project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {hasProjects && layout === "grid" && (
        <div className="space-y-6">
          <div className={`overflow-hidden ${FROSTED_CARD_SURFACE_CLASS}`}>
            <ProjectsListCardToolbar
              layout={layout}
              onLayoutChange={setLayout}
              filters={filters}
              onFiltersChange={updateFilters}
            />
            {showEmptyResults ? (
              <ProjectsEmptyState
                embedded
                variant="no-results"
                onClearFilters={clearFilters}
              />
            ) : null}
          </div>
          {!showEmptyResults ? (
            <div className="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
