import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { Search } from "lucide-react"
import type { StreamerFilter } from "../constants"
import { STREAMER_FILTERS, STREAMER_PLANS } from "../constants"

interface StreamersToolbarProps {
  activeFilter: StreamerFilter
  onFilterChange: (filter: StreamerFilter) => void
  planFilter: string
  onPlanChange: (plan: string) => void
  search: string
  onSearchChange: (value: string) => void
}

export function StreamersToolbar({
  activeFilter,
  onFilterChange,
  planFilter,
  onPlanChange,
  search,
  onSearchChange,
}: StreamersToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-1">
        {STREAMER_FILTERS.map((filter) => {
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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select value={planFilter} onValueChange={onPlanChange}>
          <SelectTrigger size="sm" aria-label="Filter by plan" className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            {STREAMER_PLANS.map((plan) => (
              <SelectItem key={plan} value={plan}>
                {plan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search users..."
            aria-label="Search users"
            className="h-9 w-full pl-9 sm:w-64"
          />
        </div>
      </div>
    </div>
  )
}
