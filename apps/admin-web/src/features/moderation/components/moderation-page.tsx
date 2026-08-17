import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { useModerationReportsQuery } from "../api/moderation-hooks"
import type { ModerationFilter } from "../constants"
import { ModerationPageHeader } from "./moderation-page-header"
import { ModerationStatCards } from "./moderation-stat-cards"
import { ModerationTable } from "./moderation-table"
import { ModerationToolbar } from "./moderation-toolbar"

export function ModerationPage({ role }: { role: WorkspaceRoleId }) {
  const [activeFilter, setActiveFilter] = useState<ModerationFilter>("all")
  const [search, setSearch] = useState("")
  const { data, isLoading } = useModerationReportsQuery({
    filter: activeFilter,
    q: search,
    page: 1,
    pageSize: 50,
  })

  const reports = data?.items ?? []

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <ModerationPageHeader />

      <ModerationStatCards reports={reports} stats={data?.stats} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <ModerationToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
          />
          {isLoading ? (
            <p className="py-10 text-center text-muted-foreground text-sm">
              Loading reports…
            </p>
          ) : (
            <ModerationTable reports={reports} role={role} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
