import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { ProjectFilter } from "../constants"
import { MOCK_PROJECTS } from "../data/mock-projects"
import { ProjectsPageHeader } from "./projects-page-header"
import { ProjectsStatCards } from "./projects-stat-cards"
import { ProjectsTable } from "./projects-table"
import { ProjectsToolbar } from "./projects-toolbar"

function matchesFilter(
  project: (typeof MOCK_PROJECTS)[number],
  filter: ProjectFilter
) {
  switch (filter) {
    case "pending-review":
      return project.reviewStatus === "pending"
    case "rejected":
      return project.reviewStatus === "rejected"
    default:
      return true
  }
}

export function ProjectsPage({ role }: { role: WorkspaceRoleId }) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return MOCK_PROJECTS.filter((project) => {
      if (!matchesFilter(project, activeFilter)) return false
      if (!query) return true

      const haystack =
        `${project.title} ${project.genre} ${project.creatorName} ${project.language}`.toLowerCase()

      return haystack.includes(query)
    })
  }, [activeFilter, search])

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <ProjectsPageHeader />

      <ProjectsStatCards projects={MOCK_PROJECTS} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <ProjectsToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
          />
          <ProjectsTable projects={filtered} role={role} />
        </CardContent>
      </Card>
    </div>
  )
}
