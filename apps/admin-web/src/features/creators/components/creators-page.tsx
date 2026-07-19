import type { AdminCreatorStats } from "@sable/contracts"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { useCreatorsQuery } from "../api/creators-hooks"
import type { CreatorFilter } from "../constants"
import { CreatorsPageHeader } from "./creators-page-header"
import { CreatorsStatCards } from "./creators-stat-cards"
import { CreatorsTable } from "./creators-table"
import { CreatorsToolbar } from "./creators-toolbar"

const EMPTY_STATS: AdminCreatorStats = {
  total: 0,
  active: 0,
  suspended: 0,
  newThisMonth: 0,
}

export function CreatorsPage({ role }: { role: WorkspaceRoleId }) {
  const [activeFilter, setActiveFilter] = useState<CreatorFilter>("all")
  const [search, setSearch] = useState("")

  const { data, isPending, isError, error, refetch, isFetching } =
    useCreatorsQuery({ filter: activeFilter, q: search })

  const creators = data?.items ?? []
  const stats = data?.stats ?? EMPTY_STATS

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <CreatorsPageHeader />

      <CreatorsStatCards stats={stats} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <CreatorsToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
          />

          {isError ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-muted-foreground text-sm">
                {error instanceof Error
                  ? error.message
                  : "Failed to load creators."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-primary text-sm underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          ) : isPending ? (
            <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
              Loading creators…
            </div>
          ) : (
            <CreatorsTable
              creators={creators}
              role={role}
              isRefreshing={isFetching}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
