import { Card } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import {
  useAdminTicketsQuery,
  useReplyAdminTicket,
  useUpdateAdminTicket,
} from "../api/support-hooks"
import { useAdminSupportRealtime } from "../api/support-socket"
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

export function SupportPage({
  role: _role,
  ticketId,
}: {
  role: WorkspaceRoleId
  ticketId?: string
}) {
  useAdminSupportRealtime()
  const { data, isLoading } = useAdminTicketsQuery()
  const updateTicket = useUpdateAdminTicket()
  const replyTicket = useReplyAdminTicket()
  const tickets = (data?.items ?? []) as SupportTicket[]
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<TicketFilter>("all")

  useEffect(() => {
    if (!ticketId) return
    const match = tickets.find(
      (ticket) => ticket.id === ticketId || ticket.reference === ticketId
    )
    if (match) setSelectedId(match.id)
  }, [ticketId, tickets])

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
    tickets.find((ticket) => ticket.id === (selectedId ?? filtered[0]?.id)) ??
    null

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <SupportPageHeader />
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading tickets…</p>
      ) : (
        <SupportStatCards tickets={tickets} />
      )}

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "overflow-hidden py-0")}>
        <div className="grid min-h-[640px] lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="border-border lg:border-r">
            <SupportTicketList
              tickets={filtered}
              selectedId={selectedTicket?.id ?? null}
              search={search}
              activeFilter={activeFilter}
              onSearchChange={setSearch}
              onFilterChange={setActiveFilter}
              onSelect={setSelectedId}
            />
          </div>
          <SupportTicketDetail
            ticket={selectedTicket}
            onStatusChange={(status: TicketStatus) => {
              if (!selectedTicket) return
              void updateTicket.mutateAsync({
                id: selectedTicket.id,
                body: { status },
              })
            }}
            onSendReply={(message) => {
              if (!selectedTicket) return
              void replyTicket.mutateAsync({
                id: selectedTicket.id,
                body: { body: message },
              })
            }}
          />
        </div>
      </Card>
    </div>
  )
}
