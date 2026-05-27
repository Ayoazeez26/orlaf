import { Outlet } from "@tanstack/react-router"
import { DashboardSidebar } from "./dashboard-sidebar"

export function DashboardLayout() {
  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <DashboardSidebar />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
