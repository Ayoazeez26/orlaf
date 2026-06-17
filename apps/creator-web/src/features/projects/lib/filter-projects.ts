import type {
  ProjectSortOption,
  ProjectSummary,
  ProjectsListFilters,
} from "../types"

export const DEFAULT_PROJECTS_LIST_FILTERS: ProjectsListFilters = {
  searchQuery: "",
  statusFilter: "all",
  sort: "newest",
}

export function hasActiveProjectFilters(filters: ProjectsListFilters): boolean {
  return filters.statusFilter !== "all" || filters.sort !== "newest"
}

function matchesSearch(project: ProjectSummary, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  const title = project.title.toLowerCase()
  const genre = (project.genre ?? "").toLowerCase()
  const type = project.type.toLowerCase()

  return (
    title.includes(normalized) ||
    genre.includes(normalized) ||
    type.includes(normalized)
  )
}

function matchesStatus(
  project: ProjectSummary,
  statusFilter: ProjectsListFilters["statusFilter"]
): boolean {
  if (statusFilter === "all") return true
  return project.status === statusFilter
}

function compareProjects(
  a: ProjectSummary,
  b: ProjectSummary,
  sort: ProjectSortOption
): number {
  if (sort === "title-asc") {
    return a.title.localeCompare(b.title)
  }
  return b.updatedAtMs - a.updatedAtMs
}

export function filterProjects(
  projects: ProjectSummary[],
  filters: ProjectsListFilters
): ProjectSummary[] {
  return projects
    .filter(
      (project) =>
        matchesSearch(project, filters.searchQuery) &&
        matchesStatus(project, filters.statusFilter)
    )
    .sort((a, b) => compareProjects(a, b, filters.sort))
}
