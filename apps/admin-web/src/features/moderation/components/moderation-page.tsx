import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { ModerationFilter } from "../constants"
import { MOCK_MODERATION_REPORTS } from "../data/mock-moderation"
import type { ModerationReport } from "../types"
import { ModerationPageHeader } from "./moderation-page-header"
import { ModerationStatCards } from "./moderation-stat-cards"
import { ModerationTable } from "./moderation-table"
import { ModerationToolbar } from "./moderation-toolbar"

function matchesFilter(report: ModerationReport, filter: ModerationFilter) {
  if (filter === "all") return true
  return report.status === filter
}

export function ModerationPage({ role }: { role: WorkspaceRoleId }) {
  const [activeFilter, setActiveFilter] = useState<ModerationFilter>("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return MOCK_MODERATION_REPORTS.filter((report) => {
      if (!matchesFilter(report, activeFilter)) return false
      if (query) {
        const haystack =
          `${report.title} ${report.parent ?? ""} ${report.reason}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [activeFilter, search])

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <ModerationPageHeader />

      <ModerationStatCards reports={MOCK_MODERATION_REPORTS} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <ModerationToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
          />
          <ModerationTable reports={filtered} role={role} />
        </CardContent>
      </Card>
    </div>
  )
}
