import { ThemeSwitcher } from "@/components/theme-switcher"
import { useDashboardHome } from "../../hooks/use-dashboard-home"
import { DashboardNav } from "./dashboard-nav"
import { OnboardingProgressCard } from "./onboarding-progress-card"
import { WorkspaceSwitcher } from "./workspace-switcher"

export function DashboardSidebar() {
  const { user, onboardingProgress } = useDashboardHome()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-hidden border-border border-r bg-card px-4 py-6">
      <p className="mb-6 shrink-0 px-2 font-semibold text-foreground text-lg">
        <span className="font-bold">OrlAf</span>{" "}
        <span className="text-muted-foreground">Creators</span>
      </p>

      <WorkspaceSwitcher user={user} className="mb-6 shrink-0" />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <DashboardNav />
      </div>

      <div className="flex shrink-0 flex-col gap-4 pt-6">
        <OnboardingProgressCard progress={onboardingProgress} />
        <ThemeSwitcher />
      </div>
    </aside>
  )
}
