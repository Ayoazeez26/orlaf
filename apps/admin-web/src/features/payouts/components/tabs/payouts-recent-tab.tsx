import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { MOCK_PAYOUTS } from "../../data/mock-payouts"
import type { Payout, PayoutFilter } from "../../types"
import { ApprovePayoutDialog } from "../dialogs/approve-payout-dialog"
import { PayoutsTable } from "../payouts-table"
import { PayoutsToolbar } from "../payouts-toolbar"

function matchesFilter(payout: Payout, filter: PayoutFilter) {
  if (filter === "all") return true
  return payout.status === filter
}

export function PayoutsRecentTab() {
  const [payouts, setPayouts] = useState(MOCK_PAYOUTS)
  const [activeFilter, setActiveFilter] = useState<PayoutFilter>("all")
  const [search, setSearch] = useState("")
  const [approvingPayout, setApprovingPayout] = useState<Payout | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return payouts.filter((payout) => {
      if (!matchesFilter(payout, activeFilter)) return false
      if (query) {
        const haystack =
          `${payout.reference} ${payout.creatorName} ${payout.creatorEmail} ${payout.method}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [activeFilter, payouts, search])

  return (
    <>
      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <PayoutsToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
          />
          <PayoutsTable payouts={filtered} onApprove={setApprovingPayout} />
        </CardContent>
      </Card>

      <ApprovePayoutDialog
        open={approvingPayout !== null}
        onOpenChange={(open) => {
          if (!open) setApprovingPayout(null)
        }}
        payout={approvingPayout}
        onConfirm={() => {
          if (!approvingPayout) return
          setPayouts((current) =>
            current.map((payout) =>
              payout.id === approvingPayout.id
                ? { ...payout, status: "scheduled" }
                : payout
            )
          )
        }}
      />
    </>
  )
}
