import { Outlet } from "@tanstack/react-router"
import { useAuth } from "@/features/auth/auth-context"
import { useApplyCreatorPreferences } from "@/features/settings/hooks/use-apply-creator-preferences"
import { useSessionAccountState } from "../../hooks/use-session-account-state"
import { DashboardMobileHeader } from "./dashboard-mobile-header"
import { DashboardSidebar } from "./dashboard-sidebar"
import { PendingApprovalBanner } from "./pending-approval-banner"

export function DashboardLayout() {
  useApplyCreatorPreferences()
  useSessionAccountState()
  const { session } = useAuth()
  const showPendingBanner = session?.account_state === "pending_approval"

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background lg:flex-row">
      <DashboardSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DashboardMobileHeader />
        {showPendingBanner ? <PendingApprovalBanner /> : null}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
