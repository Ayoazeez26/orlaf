import { Outlet } from "@tanstack/react-router"
import type { WorkspaceConfig } from "../../types"
import { DashboardMobileHeader } from "./dashboard-mobile-header"
import { DashboardSidebar } from "./dashboard-sidebar"

interface DashboardLayoutProps {
  config: WorkspaceConfig
}

export function DashboardLayout({ config }: DashboardLayoutProps) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background lg:flex-row">
      <DashboardSidebar config={config} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DashboardMobileHeader config={config} />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
