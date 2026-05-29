import type {
  ProjectSortOption,
  ProjectSummary,
  ProjectsListFilters,
} from "../types"

export const DEFAULT_PROJECTS_LIST_FILTERS: ProjectsListFilters = {
  searchQuery: "",
  statuses: [],
  genre: null,
  sort: "newest",
}

export function hasActiveProjectFilters(filters: ProjectsListFilters): boolean {
  return (
    filters.statuses.length > 0 ||
    filters.genre !== null ||
    filters.sort !== "newest"
  )
}

function matchesSearch(project: ProjectSummary, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  const title = project.title.toLowerCase()
  const genre = (project.genre ?? "").toLowerCase()

  return title.includes(normalized) || genre.includes(normalized)
}

function matchesStatus(
  project: ProjectSummary,
  statuses: ProjectsListFilters["statuses"]
): boolean {
  if (statuses.length === 0) return true
  return statuses.includes(project.status)
}

function matchesGenre(
  project: ProjectSummary,
  genre: ProjectsListFilters["genre"]
): boolean {
  if (genre === null) return true
  return project.genre === genre
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
        matchesStatus(project, filters.statuses) &&
        matchesGenre(project, filters.genre)
    )
    .sort((a, b) => compareProjects(a, b, filters.sort))
}
