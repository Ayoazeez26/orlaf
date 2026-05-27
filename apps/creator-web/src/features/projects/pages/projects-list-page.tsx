import { useState } from "react"
import { AddProjectCard } from "../components/list/add-project-card"
import { ProjectCard } from "../components/list/project-card"
import { ProjectListRow } from "../components/list/project-list-row"
import {
  ProjectsGrid,
  ProjectsListSkeleton,
  ProjectsListToolbar,
} from "../components/list/projects-list-toolbar"
import { useProjectsList } from "../hooks/use-projects-list"

export function ProjectsListPage() {
  const { data: projects, isLoading, isError } = useProjectsList()
  const [layout, setLayout] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl text-foreground">Projects</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Track performance across all your series
          </p>
        </div>
        <ProjectsListToolbar layout={layout} onLayoutChange={setLayout} />
      </div>

      {isLoading && <ProjectsListSkeleton />}

      {isError && (
        <p className="text-destructive text-sm">
          Could not load projects. Please try again.
        </p>
      )}

      {projects && (
        <ProjectsGrid
          layout={layout}
          listContent={
            <>
              {projects.map((project, index) => (
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
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <AddProjectCard />
        </ProjectsGrid>
      )}
    </div>
  )
}
