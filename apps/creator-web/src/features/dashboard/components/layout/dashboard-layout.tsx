import { Outlet } from "@tanstack/react-router"
import { DashboardMobileHeader } from "./dashboard-mobile-header"
import { DashboardSidebar } from "./dashboard-sidebar"

export function DashboardLayout() {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background lg:flex-row">
      <DashboardSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DashboardMobileHeader />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
