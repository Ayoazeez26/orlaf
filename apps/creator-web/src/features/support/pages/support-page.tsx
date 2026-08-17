import {
  useCreatorTicketQuery,
  useCreatorTicketsQuery,
} from "../api/support-hooks"
import { useCreatorSupportRealtime } from "../api/support-socket"
import { ArticleDetail } from "../components/article-detail"
import { ArticlesPanel } from "../components/articles-panel"
import { GuidelinesPanel } from "../components/guidelines-panel"
import { LiveChatPanel } from "../components/live-chat-panel"
import { NewTicketForm } from "../components/new-ticket-form"
import { SupportTabs } from "../components/support-tabs"
import { TicketDetailPanel } from "../components/ticket-detail-panel"
import { TicketsPanel } from "../components/tickets-panel"
import type { SupportTab } from "../types"

export interface SupportSearchState {
  tab: SupportTab
  ticket?: string
  article?: string
  compose?: boolean
}

interface SupportPageProps {
  search: SupportSearchState
  onSearchChange: (next: SupportSearchState) => void
}

export function SupportPage({ search, onSearchChange }: SupportPageProps) {
  useCreatorSupportRealtime()
  const ticketsQuery = useCreatorTicketsQuery()
  const tickets = ticketsQuery.data?.items ?? []
  const detailQuery = useCreatorTicketQuery(
    search.tab === "ticket" && search.ticket && !search.compose
      ? search.ticket
      : undefined
  )

  const selectedTicket =
    detailQuery.data ??
    tickets.find(
      (ticket) =>
        ticket.id === search.ticket || ticket.reference === search.ticket
    )

  function setTab(tab: SupportTab) {
    onSearchChange({
      tab,
      ticket: tab === "ticket" ? search.ticket : undefined,
      article: tab === "articles" ? search.article : undefined,
      compose: tab === "ticket" ? search.compose : undefined,
    })
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Support
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Find answers, open a ticket, or chat with our team
        </p>
      </div>

      <SupportTabs active={search.tab} onChange={setTab} />

      {search.tab === "articles" ? (
        search.article ? (
          <ArticleDetail
            articleId={search.article}
            onBack={() => onSearchChange({ tab: "articles" })}
            onOpenArticle={(id) =>
              onSearchChange({ tab: "articles", article: id })
            }
            onOpenChat={() => onSearchChange({ tab: "chat" })}
            onOpenTicket={() =>
              onSearchChange({ tab: "ticket", compose: true })
            }
          />
        ) : (
          <ArticlesPanel
            onOpenArticle={(id) =>
              onSearchChange({ tab: "articles", article: id })
            }
          />
        )
      ) : null}

      {search.tab === "ticket" ? (
        search.compose ? (
          <NewTicketForm
            onBack={() => onSearchChange({ tab: "ticket" })}
            onCreated={(id) => onSearchChange({ tab: "ticket", ticket: id })}
          />
        ) : search.ticket ? (
          selectedTicket ? (
            <TicketDetailPanel
              ticket={selectedTicket}
              onBack={() => onSearchChange({ tab: "ticket" })}
            />
          ) : detailQuery.isPending || ticketsQuery.isPending ? (
            <p className="text-muted-foreground text-sm">Loading ticket…</p>
          ) : (
            <TicketsPanel
              tickets={tickets}
              isLoading={false}
              onOpenTicket={(id) =>
                onSearchChange({ tab: "ticket", ticket: id })
              }
              onNewTicket={() =>
                onSearchChange({ tab: "ticket", compose: true })
              }
            />
          )
        ) : (
          <TicketsPanel
            tickets={tickets}
            isLoading={ticketsQuery.isPending}
            onOpenTicket={(id) => onSearchChange({ tab: "ticket", ticket: id })}
            onNewTicket={() => onSearchChange({ tab: "ticket", compose: true })}
          />
        )
      ) : null}

      {search.tab === "chat" ? <LiveChatPanel /> : null}

      {search.tab === "guidelines" ? (
        <GuidelinesPanel
          onReport={() => onSearchChange({ tab: "ticket", compose: true })}
        />
      ) : null}
    </div>
  )
}
