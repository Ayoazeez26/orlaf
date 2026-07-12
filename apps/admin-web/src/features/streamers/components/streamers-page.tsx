import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { StreamerFilter } from "../constants"
import { MOCK_STREAMERS } from "../data/mock-streamers"
import { StreamersPageHeader } from "./streamers-page-header"
import { StreamersStatCards } from "./streamers-stat-cards"
import { StreamersTable } from "./streamers-table"
import { StreamersToolbar } from "./streamers-toolbar"

function matchesFilter(
  streamer: (typeof MOCK_STREAMERS)[number],
  filter: StreamerFilter
) {
  switch (filter) {
    case "active":
      return streamer.status === "active"
    case "suspended":
      return streamer.status === "suspended"
    case "banned":
      return streamer.status === "banned"
    case "new":
      return streamer.isNew
    default:
      return true
  }
}

export function StreamersPage({ role }: { role: WorkspaceRoleId }) {
  const [activeFilter, setActiveFilter] = useState<StreamerFilter>("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return MOCK_STREAMERS.filter((streamer) => {
      if (!matchesFilter(streamer, activeFilter)) return false
      if (planFilter !== "all" && streamer.plan !== planFilter) return false
      if (query) {
        const haystack =
          `${streamer.name} ${streamer.username} ${streamer.email}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [activeFilter, planFilter, search])

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <StreamersPageHeader />

      <StreamersStatCards streamers={MOCK_STREAMERS} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <StreamersToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            planFilter={planFilter}
            onPlanChange={setPlanFilter}
            search={search}
            onSearchChange={setSearch}
          />
          <StreamersTable streamers={filtered} role={role} />
        </CardContent>
      </Card>
    </div>
  )
}
