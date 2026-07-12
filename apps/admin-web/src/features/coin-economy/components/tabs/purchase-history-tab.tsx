import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { MOCK_COIN_PURCHASES } from "../../data/mock-purchases"
import type { CoinPurchase, PurchaseFilter } from "../../types"
import { PurchaseHistoryTable } from "../purchase-history-table"
import { PurchaseHistoryToolbar } from "../purchase-history-toolbar"

function matchesFilter(purchase: CoinPurchase, filter: PurchaseFilter) {
  if (filter === "all") return true
  return purchase.status === filter
}

export function PurchaseHistoryTab() {
  const [activeFilter, setActiveFilter] = useState<PurchaseFilter>("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return MOCK_COIN_PURCHASES.filter((purchase) => {
      if (!matchesFilter(purchase, activeFilter)) return false
      if (query) {
        const haystack =
          `${purchase.receipt} ${purchase.userName} ${purchase.userEmail} ${purchase.method}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [activeFilter, search])

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
