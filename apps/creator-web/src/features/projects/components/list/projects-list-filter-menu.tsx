import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import { SlidersHorizontal } from "lucide-react"
import {
  ALL_GENRES_LABEL,
  GENRE_OPTIONS,
  PROJECT_SORT_OPTIONS,
  PROJECT_STATUS_FILTER_OPTIONS,
} from "../../constants"
import { hasActiveProjectFilters } from "../../lib/filter-projects"
import type { ProjectStatus, ProjectsListFilters } from "../../types"

interface ProjectsListFilterMenuProps {
  filters: ProjectsListFilters
  onFiltersChange: (patch: Partial<ProjectsListFilters>) => void
  onClearFilters: () => void
}

export function ProjectsListFilterMenu({
  filters,
  onFiltersChange,
  onClearFilters,
}: ProjectsListFilterMenuProps) {
  const filtersActive = hasActiveProjectFilters(filters)

  function toggleStatus(status: ProjectStatus, checked: boolean) {
    const next = checked
      ? [...filters.statuses, status]
      : filters.statuses.filter((s) => s !== status)
    onFiltersChange({ statuses: next })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Filter projects"
          className={cn(
            "relative bg-card text-muted-foreground",
            filtersActive && "border-primary/40 text-primary"
          )}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          {filtersActive ? (
            <span
              className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary"
              aria-hidden
            />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Status
        </DropdownMenuLabel>
        {PROJECT_STATUS_FILTER_OPTIONS.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={filters.statuses.includes(option.value)}
            onCheckedChange={(checked) =>
              toggleStatus(option.value, checked === true)
            }
            onSelect={(e) => e.preventDefault()}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Genre
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={filters.genre ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              genre: value === "all" ? null : value,
            })
          }
        >
          <DropdownMenuRadioItem
            value="all"
            onSelect={(e) => e.preventDefault()}
          >
            {ALL_GENRES_LABEL}
          </DropdownMenuRadioItem>
          {GENRE_OPTIONS.map((genre) => (
            <DropdownMenuRadioItem
              key={genre}
              value={genre}
              onSelect={(e) => e.preventDefault()}
            >
              {genre}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Sort by
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={filters.sort}
          onValueChange={(value) =>
            onFiltersChange({
              sort: value as ProjectsListFilters["sort"],
            })
          }
        >
          {PROJECT_SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              onSelect={(e) => e.preventDefault()}
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <div className="p-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-center text-muted-foreground"
            disabled={!filtersActive}
            onClick={onClearFilters}
          >
            Clear filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
