import { Outlet } from "@tanstack/react-router"
import { DashboardSidebar } from "./dashboard-sidebar"

export function DashboardLayout() {
  return (
    <div className="flex min-h-svh bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
