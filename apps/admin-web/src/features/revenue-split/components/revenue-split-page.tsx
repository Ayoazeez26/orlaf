import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { useAdminRevenueSplit } from "../api/revenue-split-hooks"
import { RevenueSplitKpiCards } from "./revenue-split-kpi-cards"
import { RevenueSplitPageHeader } from "./revenue-split-page-header"
import { RevenueSplitTiersTable } from "./revenue-split-tiers-table"

export function RevenueSplitPage({ role: _role }: { role: WorkspaceRoleId }) {
  const { data } = useAdminRevenueSplit()

  if (!data) return null

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <RevenueSplitPageHeader />
      <RevenueSplitKpiCards kpis={data.kpis} />
      <RevenueSplitTiersTable tiers={data.tiers} />
    </div>
  )
}
