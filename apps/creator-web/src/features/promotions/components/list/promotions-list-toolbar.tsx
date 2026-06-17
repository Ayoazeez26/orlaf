import type { PromotionsListFilters } from "../../lib/filter-promotions"
import { PromotionsListSearch } from "./promotions-list-search"
import { PromotionsStatusFilterPills } from "./promotions-status-filter-pills"
import { PromotionsViewToggle } from "./promotions-view-toggle"

interface PromotionsListToolbarProps {
  layout: "grid" | "list"
  onLayoutChange: (layout: "grid" | "list") => void
  filters: PromotionsListFilters
  onFiltersChange: (patch: Partial<PromotionsListFilters>) => void
}

export function PromotionsListToolbar({
  layout,
  onLayoutChange,
  filters,
  onFiltersChange,
}: PromotionsListToolbarProps) {
  return (
    <div className="flex flex-col gap-4 border-border border-b px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <PromotionsListSearch
          value={filters.searchQuery}
          onChange={(searchQuery) => onFiltersChange({ searchQuery })}
        />
        <PromotionsViewToggle layout={layout} onLayoutChange={onLayoutChange} />
      </div>
      <PromotionsStatusFilterPills
        value={filters.statusFilter}
        onChange={(statusFilter) => onFiltersChange({ statusFilter })}
      />
    </div>
  )
}

export function PromotionsListSkeleton() {
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
          <div className="size-10 animate-pulse rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
