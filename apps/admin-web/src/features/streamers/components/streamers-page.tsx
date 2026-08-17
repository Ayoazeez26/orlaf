import type { AdminStreamerStats } from "@sable/contracts"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { TablePageSkeleton } from "@/features/workspaces/components/page-skeletons"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { useStreamersQuery } from "../api/streamers-hooks"
import type { StreamerFilter } from "../constants"
import { mapStreamerListItem } from "../lib/map-streamer"
import { StreamersPageHeader } from "./streamers-page-header"
import { StreamersStatCards } from "./streamers-stat-cards"
import { StreamersTable } from "./streamers-table"
import { StreamersToolbar } from "./streamers-toolbar"

const EMPTY_STATS: AdminStreamerStats = {
  total: 0,
  active: 0,
  suspended: 0,
  newThisMonth: 0,
}

export function StreamersPage({ role }: { role: WorkspaceRoleId }) {
  const [activeFilter, setActiveFilter] = useState<StreamerFilter>("all")
  const [search, setSearch] = useState("")

  const { data, isPending, isError, error, refetch, isFetching } =
    useStreamersQuery({ filter: activeFilter, q: search })

  const streamers = (data?.items ?? []).map(mapStreamerListItem)
  const stats = data?.stats ?? EMPTY_STATS

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <StreamersPageHeader />

      {isPending ? (
        <TablePageSkeleton />
      ) : (
        <>
          <StreamersStatCards stats={stats} />

          <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
            <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
              <StreamersToolbar
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
                      : "Failed to load streamers."}
                  </p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="text-primary text-sm underline underline-offset-4"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <StreamersTable
                  streamers={streamers}
                  role={role}
                  isRefreshing={isFetching}
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
