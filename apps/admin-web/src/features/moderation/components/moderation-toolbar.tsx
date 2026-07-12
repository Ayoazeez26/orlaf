import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { Search } from "lucide-react"
import type { ModerationFilter } from "../constants"
import { MODERATION_FILTERS } from "../constants"

interface ModerationToolbarProps {
  activeFilter: ModerationFilter
  onFilterChange: (filter: ModerationFilter) => void
  search: string
  onSearchChange: (value: string) => void
}

export function ModerationToolbar({
  activeFilter,
  onFilterChange,
  search,
  onSearchChange,
}: ModerationToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-1">
        {MODERATION_FILTERS.map((filter) => {
          const isActive = filter.key === activeFilter

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => onFilterChange(filter.key)}
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
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search reports..."
          aria-label="Search reports"
          className="h-9 w-full pl-9 sm:w-64"
        />
      </div>
    </div>
  )
}
