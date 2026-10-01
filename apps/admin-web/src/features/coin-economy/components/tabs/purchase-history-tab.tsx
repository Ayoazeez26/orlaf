import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
import { AuditLogPagination } from "@/features/audit-log/components/audit-log-table"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { useAdminCoinPurchases } from "../../api/coin-economy-hooks"
import { PURCHASE_PAGE_SIZE } from "../../constants"
import type { PurchaseFilter } from "../../types"
import { PurchaseHistoryTable } from "../purchase-history-table"
import { PurchaseHistoryToolbar } from "../purchase-history-toolbar"

export function PurchaseHistoryTab() {
  const [activeFilter, setActiveFilter] = useState<PurchaseFilter>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const purchasesQuery = useAdminCoinPurchases({
    filter: activeFilter,
    q: search.trim() || undefined,
    page,
    pageSize: PURCHASE_PAGE_SIZE,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [search, activeFilter])

  const purchases = purchasesQuery.data?.items ?? []
  const total = purchasesQuery.data?.total ?? 0

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
        <PurchaseHistoryToolbar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          search={search}
          onSearchChange={setSearch}
        />
        {purchasesQuery.isLoading ? (
          <div className="flex min-h-40 items-center justify-center text-muted-foreground text-sm">
            Loading purchase history…
          </div>
        ) : purchasesQuery.isError ? (
          <div className="flex min-h-40 items-center justify-center text-destructive text-sm">
            Could not load purchase history.
          </div>
        ) : (
          <PurchaseHistoryTable purchases={purchases} />
        )}
        <AuditLogPagination
          page={page}
          pageSize={PURCHASE_PAGE_SIZE}
          total={total}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  )
}
