import { createFileRoute } from "@tanstack/react-router"
import { CoinEconomyPage } from "@/features/coin-economy/components/coin-economy-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/coin-economy/")({
  component: WorkspaceCoinEconomy,
})

function WorkspaceCoinEconomy() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="coin-economy">
      <CoinEconomyPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
