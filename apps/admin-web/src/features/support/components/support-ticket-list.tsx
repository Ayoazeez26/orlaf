import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { Search, Wrench } from "lucide-react"
import {
  TICKET_CATEGORY_LABEL,
  TICKET_FILTERS,
  TICKET_STATUS_BADGE_CLASS,
  TICKET_STATUS_LABEL,
} from "../constants"
import type { SupportTicket, TicketFilter } from "../types"

interface SupportTicketListProps {
  tickets: SupportTicket[]
  selectedId: string | null
  search: string
  activeFilter: TicketFilter
  onSearchChange: (value: string) => void
  onFilterChange: (filter: TicketFilter) => void
  onSelect: (id: string) => void
}

export function SupportTicketList({
  tickets,
  selectedId,
  search,
  activeFilter,
  onSearchChange,
  onFilterChange,
  onSelect,
}: SupportTicketListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 border-border border-b p-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tickets..."
            aria-label="Search tickets"
            className="h-9 pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {TICKET_FILTERS.map((filter) => {
            const isActive = filter.key === activeFilter

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => onFilterChange(filter.key)}
                className={cn(
                  "rounded-full px-3 py-1 font-medium text-sm transition-colors",
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
      </div>

      <ul className="flex-1 overflow-y-auto">
        {tickets.length === 0 ? (
          <li className="p-6 text-center text-muted-foreground text-sm">
            No tickets match your filters.
          </li>
        ) : (
          tickets.map((ticket) => {
            const isSelected = ticket.id === selectedId

            return (
              <li key={ticket.id}>
                <button
                  type="button"
                  onClick={() => onSelect(ticket.id)}
                  className={cn(
                    "w-full border-border border-b px-4 py-4 text-left transition-colors last:border-0",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                      {ticket.userInitials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-foreground text-sm">
                          {ticket.userName}
                        </p>
                        <span className="shrink-0 text-muted-foreground text-xs">
                          {ticket.lastActivity}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 font-medium text-foreground text-sm">
                        {ticket.subject}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-muted-foreground text-xs">
                        {ticket.preview}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 font-medium text-[10px]",
                            TICKET_STATUS_BADGE_CLASS[ticket.status]
                          )}
                        >
                          {TICKET_STATUS_LABEL[ticket.status]}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                          {ticket.category === "technical" ? (
                            <Wrench className="size-3" aria-hidden />
                          ) : null}
                          {TICKET_CATEGORY_LABEL[ticket.category]}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
