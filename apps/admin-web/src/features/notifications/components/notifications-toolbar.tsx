import { cn } from "@workspace/ui/lib/utils"
import { NOTIFICATION_FILTERS } from "../constants"
import type { NotificationFilter } from "../types"

interface NotificationsToolbarProps {
  activeFilter: NotificationFilter
  onFilterChange: (filter: NotificationFilter) => void
}

export function NotificationsToolbar({
  activeFilter,
  onFilterChange,
}: NotificationsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {NOTIFICATION_FILTERS.map((filter) => {
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
  )
}
