import type { SupportTicket } from "@sable/contracts"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronRight } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import {
  TICKET_CATEGORY_LABEL,
  TICKET_STATUS_BADGE_CLASS,
  TICKET_STATUS_LABEL,
} from "../constants"

interface TicketsPanelProps {
  tickets: SupportTicket[]
  isLoading: boolean
  highlightedId?: string
  onOpenTicket: (id: string) => void
  onNewTicket: () => void
}

export function TicketsPanel({
  tickets,
  isLoading,
  highlightedId,
  onOpenTicket,
  onNewTicket,
}: TicketsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-foreground text-lg">
            Your tickets
          </h2>
          <p className="text-muted-foreground text-sm">
            Track issues and replies from our team.
          </p>
        </div>
        <Button type="button" onClick={onNewTicket}>
          New ticket
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading tickets…</p>
      ) : tickets.length === 0 ? (
        <div className={cn(FROSTED_CARD_SURFACE_CLASS, "p-6")}>
          <p className="text-muted-foreground text-sm">
            You don&apos;t have any tickets yet.
          </p>
        </div>
      ) : (
        <div
          className={cn(
            FROSTED_CARD_SURFACE_CLASS,
            "divide-y divide-border overflow-hidden py-0"
          )}
        >
          {tickets.map((ticket) => {
            const isTarget =
              highlightedId != null &&
              (ticket.id === highlightedId ||
                ticket.reference === highlightedId)

            return (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onOpenTicket(ticket.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50",
                  isTarget && "bg-primary/5"
                )}
              >
                <span className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">
                    {ticket.subject}
                  </p>
                  <p className="mt-1 truncate text-muted-foreground text-sm">
                    {ticket.reference} ·{" "}
                    {TICKET_CATEGORY_LABEL[ticket.category]} · Updated{" "}
                    {ticket.lastActivity}
                  </p>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-medium text-xs",
                      TICKET_STATUS_BADGE_CLASS[ticket.status]
                    )}
                  >
                    {TICKET_STATUS_LABEL[ticket.status]}
                  </span>
                  <ChevronRight
                    className="size-4 text-muted-foreground"
                    aria-hidden
                  />
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
