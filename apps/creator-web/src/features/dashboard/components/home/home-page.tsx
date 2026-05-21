import { useDashboardHome } from "../../hooks/use-dashboard-home"
import { EarnMoreSection } from "./earn-more-section"
import { RecentProjectsCard } from "./recent-projects-card"
import { ViewsEngagementCard } from "./views-engagement-card"
import { WelcomeHeader } from "./welcome-header"

export function HomePage() {
  const { user, metrics, projects, earnMoreCards } = useDashboardHome()

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <WelcomeHeader displayName={user.displayName} />
      <ViewsEngagementCard metrics={metrics} />
      <RecentProjectsCard projects={projects} />
      <EarnMoreSection cards={earnMoreCards} />
    </div>
  )
}
