import { TopEpisodesList } from "@/features/analytics/components/top-episodes-list"
import { useDashboardHome } from "../../hooks/use-dashboard-home"
import { HomeEngagementChart } from "./home-engagement-chart"
import { MetricCardsRow } from "./metric-cards-row"
import { PromotionBanner } from "./promotion-banner"
import { RecentProjectsCard } from "./recent-projects-card"
import { WelcomeHeader } from "./welcome-header"

export function HomePage() {
  const { user, kpis, projects, engagementChart, topEpisodes } =
    useDashboardHome()

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <WelcomeHeader displayName={user.displayName} />
      <MetricCardsRow kpis={kpis} />
      <RecentProjectsCard projects={projects} />
      <PromotionBanner />
      <div className="grid gap-4 lg:grid-cols-3">
        <HomeEngagementChart data={engagementChart} className="lg:col-span-2" />
        <TopEpisodesList episodes={topEpisodes} />
      </div>
    </div>
  )
}
