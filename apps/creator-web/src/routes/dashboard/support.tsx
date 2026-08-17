import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  SupportPage,
  type SupportSearchState,
} from "@/features/support/pages/support-page"
import type { SupportTab } from "@/features/support/types"

function parseTab(value: unknown): SupportTab | undefined {
  if (
    value === "articles" ||
    value === "ticket" ||
    value === "chat" ||
    value === "guidelines"
  ) {
    return value
  }
  return undefined
}

export const Route = createFileRoute("/dashboard/support")({
  validateSearch: (search: Record<string, unknown>): SupportSearchState => {
    const ticket = typeof search.ticket === "string" ? search.ticket : undefined
    const article =
      typeof search.article === "string" ? search.article : undefined
    const compose =
      search.compose === true ||
      search.compose === "1" ||
      search.compose === "true"
    const tab =
      parseTab(search.tab) ??
      (ticket ? "ticket" : article ? "articles" : "articles")

    return {
      tab,
      ticket,
      article,
      compose: compose || undefined,
    }
  },
  component: SupportRoute,
})

function SupportRoute() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: "/dashboard/support" })

  return (
    <SupportPage
      search={search}
      onSearchChange={(next) => {
        void navigate({
          to: "/dashboard/support",
          search: {
            tab: next.tab,
            ticket: next.ticket,
            article: next.article,
            compose: next.compose || undefined,
          },
        })
      }}
    />
  )
}
