import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { AUDIT_PAGE_SIZE } from "../constants"
import { MOCK_AUDIT_LOG } from "../data/mock-audit-log"
import type {
  AuditActionFilter,
  AuditLogEntry,
  AuditRoleFilter,
} from "../types"
import { AuditLogPageHeader } from "./audit-log-page-header"
import { AuditLogPagination, AuditLogTable } from "./audit-log-table"
import { AuditLogToolbar } from "./audit-log-toolbar"

function matchesFilters(
  entry: AuditLogEntry,
  search: string,
  actionFilter: AuditActionFilter,
  roleFilter: AuditRoleFilter
) {
  if (actionFilter !== "all" && entry.action !== actionFilter) return false
  if (roleFilter !== "all" && entry.role !== roleFilter) return false

  const query = search.trim().toLowerCase()
  if (!query) return true

  const haystack =
    `${entry.userName} ${entry.userEmail} ${entry.target} ${entry.action}`.toLowerCase()
  return haystack.includes(query)
}

export function AuditLogPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState<AuditActionFilter>("all")
  const [roleFilter, setRoleFilter] = useState<AuditRoleFilter>("all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () =>
      MOCK_AUDIT_LOG.filter((entry) =>
        matchesFilters(entry, search, actionFilter, roleFilter)
      ),
    [search, actionFilter, roleFilter]
  )

  const paginated = useMemo(() => {
    const start = (page - 1) * AUDIT_PAGE_SIZE
    return filtered.slice(start, start + AUDIT_PAGE_SIZE)
  }, [filtered, page])

  useEffect(() => {
    setPage(1)
  }, [])

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
          <AuditLogTable entries={paginated} />
          <AuditLogPagination
            page={page}
            pageSize={AUDIT_PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
