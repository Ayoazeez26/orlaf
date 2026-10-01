import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import {
  useAdminPayouts,
  useApproveAdminPayout,
  useMarkAdminPayoutPaid,
} from "../../api/payouts-hooks"
import type { Payout, PayoutFilter } from "../../types"
import { ApprovePayoutDialog } from "../dialogs/approve-payout-dialog"
import { PayoutsTable } from "../payouts-table"
import { PayoutsToolbar } from "../payouts-toolbar"

function matchesFilter(payout: Payout, filter: PayoutFilter) {
  if (filter === "all") return true
  return payout.status === filter
}

export function PayoutsRecentTab() {
  const { data } = useAdminPayouts()
  const approvePayout = useApproveAdminPayout()
  const markPaid = useMarkAdminPayoutPaid()
  const payouts = data?.items ?? []
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
          <PayoutsTable
            payouts={filtered}
            onApprove={setApprovingPayout}
            onMarkPaid={(payout) => markPaid.mutate(payout.id)}
          />
        </CardContent>
      </Card>

      <ApprovePayoutDialog
        open={approvingPayout !== null}
        onOpenChange={(open) => {
          if (!open) setApprovingPayout(null)
        }}
        payout={approvingPayout}
        onConfirm={(scheduledFor, internalNote) => {
          if (!approvingPayout) return
          approvePayout.mutate({
            payoutId: approvingPayout.id,
            body: {
              scheduled_for: scheduledFor,
              internal_note: internalNote,
            },
          })
        }}
      />
    </>
  )
}
