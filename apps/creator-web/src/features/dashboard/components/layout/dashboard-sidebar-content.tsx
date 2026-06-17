import { Separator } from "@workspace/ui/components/separator"
import { useDashboardHome } from "../../hooks/use-dashboard-home"
import { DashboardLogo } from "./dashboard-logo"
import { DashboardNav } from "./dashboard-nav"
import { SidebarUserProfile } from "./sidebar-user-profile"

interface DashboardSidebarContentProps {
  onNavigate?: () => void
}

export function DashboardSidebarContent({
  onNavigate,
}: DashboardSidebarContentProps) {
  const { user } = useDashboardHome()

  return (
    <>
      <div className="mb-8 shrink-0">
        <DashboardLogo />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <DashboardNav onNavigate={onNavigate} />
      </div>

      <div className="shrink-0 pt-4">
        <Separator className="mb-4" />
        <SidebarUserProfile user={user} />
      </div>
    </>
  )
}
