import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { CreatorFilter } from "../constants"
import { MOCK_CREATORS } from "../data/mock-creators"
import { CreatorsPageHeader } from "./creators-page-header"
import { CreatorsStatCards } from "./creators-stat-cards"
import { CreatorsTable } from "./creators-table"
import { CreatorsToolbar } from "./creators-toolbar"

function matchesFilter(
  creator: (typeof MOCK_CREATORS)[number],
  filter: CreatorFilter
) {
  switch (filter) {
    case "active":
      return creator.status === "active"
    case "suspended":
      return creator.status === "suspended"
    case "new":
      return creator.isNew
    default:
      return true
  }
}

export function CreatorsPage({ role }: { role: WorkspaceRoleId }) {
  const [activeFilter, setActiveFilter] = useState<CreatorFilter>("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return MOCK_CREATORS.filter((creator) => {
      if (!matchesFilter(creator, activeFilter)) return false
      if (query) {
        const haystack =
          `${creator.name} ${creator.username} ${creator.email}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [activeFilter, search])

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <CreatorsPageHeader />

      <CreatorsStatCards creators={MOCK_CREATORS} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <CreatorsToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
          />
          <CreatorsTable creators={filtered} role={role} />
        </CardContent>
      </Card>
    </div>
  )
}
