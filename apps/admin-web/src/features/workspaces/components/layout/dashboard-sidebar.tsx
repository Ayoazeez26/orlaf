import type { WorkspaceConfig } from "../../types"
import { DashboardSidebarContent } from "./dashboard-sidebar-content"

interface DashboardSidebarProps {
  config: WorkspaceConfig
}

export function DashboardSidebar({ config }: DashboardSidebarProps) {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-border border-r bg-card px-4 py-6 lg:flex">
      <DashboardSidebarContent config={config} />
    </aside>
  )
}
