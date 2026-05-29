import { DashboardSidebarContent } from "./dashboard-sidebar-content"

export function DashboardSidebar() {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-border border-r bg-card px-4 py-6 lg:flex">
      <DashboardSidebarContent />
    </aside>
  )
}
