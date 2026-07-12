import { Separator } from "@workspace/ui/components/separator"
import type { WorkspaceConfig } from "../../types"
import { DashboardLogo } from "./dashboard-logo"
import { DashboardNav } from "./dashboard-nav"
import { SidebarUserProfile } from "./sidebar-user-profile"

interface DashboardSidebarContentProps {
  config: WorkspaceConfig
  onNavigate?: () => void
}

export function DashboardSidebarContent({
  config,
  onNavigate,
}: DashboardSidebarContentProps) {
  return (
    <>
      <div className="mb-8 shrink-0">
        <DashboardLogo subtitle={config.name} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <DashboardNav
          role={config.id}
          groups={config.navGroups}
          onNavigate={onNavigate}
        />
      </div>

      <div className="shrink-0 pt-4">
        <Separator className="mb-4" />
        <SidebarUserProfile
          user={config.user}
          roleName={config.name}
          roleId={config.id}
        />
      </div>
    </>
  )
}
