import { Card } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import {
  DEFAULT_SELECTED_TICKET_ID,
  MOCK_SUPPORT_TICKETS,
} from "../data/mock-support-tickets"
import type { SupportTicket, TicketFilter, TicketStatus } from "../types"
import { SupportPageHeader } from "./support-page-header"
import { SupportStatCards } from "./support-stat-cards"
import { SupportTicketDetail } from "./support-ticket-detail"
import { SupportTicketList } from "./support-ticket-list"

function matchesFilter(ticket: SupportTicket, filter: TicketFilter) {
  switch (filter) {
    case "open":
      return ticket.status === "open"
    case "active":
      return ticket.status === "in-progress"
    case "resolved":
      return ticket.status === "resolved"
    case "closed":
      return ticket.status === "closed"
    default:
      return true
  }
}

export function SupportPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS)
  const [selectedId, setSelectedId] = useState<string | null>(
    DEFAULT_SELECTED_TICKET_ID
  )
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<TicketFilter>("all")

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return tickets.filter((ticket) => {
      if (!matchesFilter(ticket, activeFilter)) return false
      if (query) {
        const haystack =
          `${ticket.userName} ${ticket.subject} ${ticket.preview} ${ticket.reference}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [tickets, activeFilter, search])

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedId) ?? null

  function updateTicket(id: string, patch: Partial<SupportTicket>) {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === id ? { ...ticket, ...patch } : ticket
      )
    )
  }

  function handleStatusChange(status: TicketStatus) {
    if (!selectedId) return
    updateTicket(selectedId, { status })
  }

  function handleSendReply(message: string) {
    if (!selectedId) return

    setTickets((current) =>
      current.map((ticket) => {
        if (ticket.id !== selectedId) return ticket

        return {
          ...ticket,
          messages: [
            ...ticket.messages,
            {
              id: `m-${Date.now()}`,
              author: "Admin",
              isAdmin: true,
              body: message,
              timestamp: "Just now",
            },
          ],
          lastActivity: "Just now",
          status: ticket.status === "open" ? "in-progress" : ticket.status,
        }
      })
    )
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <SupportPageHeader />
      <SupportStatCards tickets={tickets} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "overflow-hidden py-0")}>
        <div className="grid min-h-[640px] lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="border-border lg:border-r">
            <SupportTicketList
              tickets={filtered}
              selectedId={selectedId}
              search={search}
              activeFilter={activeFilter}
              onSearchChange={setSearch}
              onFilterChange={setActiveFilter}
              onSelect={setSelectedId}
            />
          </div>
          <SupportTicketDetail
            ticket={selectedTicket}
            onStatusChange={handleStatusChange}
            onSendReply={handleSendReply}
          />
        </div>
      </Card>
    </div>
  )
}
