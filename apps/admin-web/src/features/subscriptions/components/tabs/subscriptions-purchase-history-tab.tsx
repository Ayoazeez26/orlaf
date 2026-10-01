import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { useAdminSubscriptionPurchases } from "../../api/subscriptions-hooks"
import type { PurchaseFilter } from "../../types"
import { PurchaseHistoryTable } from "../purchase-history-table"
import { PurchaseHistoryToolbar } from "../purchase-history-toolbar"

export function SubscriptionsPurchaseHistoryTab() {
  const [activeFilter, setActiveFilter] = useState<PurchaseFilter>("all")
  const [search, setSearch] = useState("")
  const { data } = useAdminSubscriptionPurchases({
    filter: activeFilter,
    q: search.trim() || undefined,
    page: 1,
    pageSize: 50,
  })

  const filtered = data?.items ?? []

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
        <PurchaseHistoryToolbar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          search={search}
          onSearchChange={setSearch}
        />
        <PurchaseHistoryTable purchases={filtered} />
      </CardContent>
    </Card>
  )
}
