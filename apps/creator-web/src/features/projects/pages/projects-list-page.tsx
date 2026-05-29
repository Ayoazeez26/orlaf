import { useMemo, useState } from "react"
import { AddProjectCard } from "../components/list/add-project-card"
import { ProjectCard } from "../components/list/project-card"
import { ProjectListRow } from "../components/list/project-list-row"
import {
  ProjectsGrid,
  ProjectsListSkeleton,
  ProjectsListToolbar,
} from "../components/list/projects-list-toolbar"
import { useProjectsList } from "../hooks/use-projects-list"
import {
  DEFAULT_PROJECTS_LIST_FILTERS,
  filterProjects,
} from "../lib/filter-projects"
import type { ProjectsListFilters } from "../types"

export function ProjectsListPage() {
  const { data: projects, isLoading, isError } = useProjectsList()
  const [layout, setLayout] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<ProjectsListFilters>(
    DEFAULT_PROJECTS_LIST_FILTERS
  )

  const filteredProjects = useMemo(
    () => (projects ? filterProjects(projects, filters) : []),
    [projects, filters]
  )

  const showEmptyResults =
    projects && projects.length > 0 && filteredProjects.length === 0

  function updateFilters(patch: Partial<ProjectsListFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  function clearFilters() {
    setFilters((prev) => ({
      ...prev,
      statuses: [],
      genre: null,
      sort: "newest",
    }))
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-bold text-2xl text-foreground">Projects</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Track performance across all your series
          </p>
        </div>
        <ProjectsListToolbar
          layout={layout}
          onLayoutChange={setLayout}
          searchQuery={filters.searchQuery}
          onSearchChange={(searchQuery) => updateFilters({ searchQuery })}
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
        />
      </div>

      {isLoading && <ProjectsListSkeleton />}

      {isError && (
        <p className="text-destructive text-sm">
          Could not load projects. Please try again.
        </p>
      )}

      {showEmptyResults && (
        <p className="text-muted-foreground text-sm">
          No projects match your search or filters.
        </p>
      )}

      {projects && filteredProjects.length > 0 && (
        <ProjectsGrid
          layout={layout}
          listContent={
            <>
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={index > 0 ? "border-border border-t" : undefined}
                >
                  <ProjectListRow project={project} />
                </div>
              ))}
              <AddProjectCard variant="list" />
            </>
          }
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <AddProjectCard />
        </ProjectsGrid>
      )}
    </div>
  )
}
