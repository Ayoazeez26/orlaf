import { useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import {
  DEFAULT_REVENUE_SPLIT_TIERS,
  REVENUE_SPLIT_KPIS,
} from "../data/mock-revenue-split"
import type { RevenueSplitTier, RevenueSplitTierId } from "../types"
import { RevenueSplitKpiCards } from "./revenue-split-kpi-cards"
import { RevenueSplitPageHeader } from "./revenue-split-page-header"
import { RevenueSplitTiersTable } from "./revenue-split-tiers-table"

export function RevenueSplitPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [tiers, setTiers] = useState<RevenueSplitTier[]>(
    DEFAULT_REVENUE_SPLIT_TIERS
  )

  function updateTier(
    id: RevenueSplitTierId,
    patch: Partial<RevenueSplitTier>
  ) {
    setTiers((current) =>
      current.map((tier) => (tier.id === id ? { ...tier, ...patch } : tier))
    )
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <RevenueSplitPageHeader />
      <RevenueSplitKpiCards kpis={REVENUE_SPLIT_KPIS} />
      <RevenueSplitTiersTable tiers={tiers} onChange={updateTier} />
    </div>
  )
}
