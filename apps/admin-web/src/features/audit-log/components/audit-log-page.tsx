import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { useAuditLogQuery } from "../api/audit-hooks"
import { AUDIT_PAGE_SIZE } from "../constants"
import type { AuditActionFilter, AuditRoleFilter } from "../types"
import { AuditLogPageHeader } from "./audit-log-page-header"
import { AuditLogPagination, AuditLogTable } from "./audit-log-table"
import { AuditLogToolbar } from "./audit-log-toolbar"

export function AuditLogPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState<AuditActionFilter>("all")
  const [roleFilter, setRoleFilter] = useState<AuditRoleFilter>("all")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAuditLogQuery({
    q: search,
    action: actionFilter,
    page,
    pageSize: AUDIT_PAGE_SIZE,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets pagination whenever a filter changes, deps are intentional
  useEffect(() => {
    setPage(1)
  }, [search, actionFilter, roleFilter])

  const entries = (data?.items ?? []).filter((entry) =>
    roleFilter === "all" ? true : entry.role === roleFilter
  )

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <AuditLogPageHeader />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <AuditLogToolbar
            search={search}
            onSearchChange={setSearch}
            actionFilter={actionFilter}
            onActionFilterChange={setActionFilter}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
          />
          {isLoading ? (
            <p className="py-10 text-center text-muted-foreground text-sm">
              Loading audit log…
            </p>
          ) : (
            <AuditLogTable entries={entries} />
          )}
          <AuditLogPagination
            page={page}
            pageSize={AUDIT_PAGE_SIZE}
            total={data?.total ?? 0}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
