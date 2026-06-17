import type { ProjectsListFilters } from "../../types"
import { ProjectsListSearch } from "./projects-list-search"
import { ProjectsStatusFilterPills } from "./projects-status-filter-pills"
import { ProjectsViewToggle } from "./projects-view-toggle"

interface ProjectsListCardToolbarProps {
  layout: "grid" | "list"
  onLayoutChange: (layout: "grid" | "list") => void
  filters: ProjectsListFilters
  onFiltersChange: (patch: Partial<ProjectsListFilters>) => void
}

export function ProjectsListCardToolbar({
  layout,
  onLayoutChange,
  filters,
  onFiltersChange,
}: ProjectsListCardToolbarProps) {
  return (
    <div className="flex flex-col gap-4 border-border border-b px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ProjectsListSearch
          value={filters.searchQuery}
          onChange={(searchQuery) => onFiltersChange({ searchQuery })}
        />
        <ProjectsViewToggle layout={layout} onLayoutChange={onLayoutChange} />
      </div>
      <ProjectsStatusFilterPills
        value={filters.statusFilter}
        onChange={(statusFilter) => onFiltersChange({ statusFilter })}
      />
    </div>
  )
}

export function ProjectsListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-border border-b px-6 py-4">
        <div className="h-10 w-full max-w-xs animate-pulse rounded-xl bg-muted" />
      </div>
      {(["a", "b", "c"] as const).map((id) => (
        <div
          key={id}
          className="flex items-center gap-4 border-border border-b px-6 py-4 last:border-b-0"
        >
          <div className="h-[70px] w-12 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
