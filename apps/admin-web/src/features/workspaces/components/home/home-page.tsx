import type { AdminAnalyticsSummary } from "@sable/contracts"
import { useAdminAnalyticsSummary } from "@/features/analytics/api/analytics-hooks"
import { applyAnalyticsSummary } from "../../lib/apply-analytics-summary"
import type { WorkspaceConfig } from "../../types"
import { HomePageSkeleton } from "../page-skeletons"
import { MetricCardsRow } from "./metric-cards-row"
import { PrimaryPanelCard } from "./primary-panel-card"
import { SideCard } from "./side-card"
import { WelcomeHeader } from "./welcome-header"

const EMPTY_SUMMARY: AdminAnalyticsSummary = {
  total_users: 0,
  total_creators: 0,
  published_series: 0,
  pending_review_series: 0,
  flagged_series: 0,
  views_30d: 0,
  new_creators_7d: 0,
}

interface HomePageProps {
  config: WorkspaceConfig
}

export function HomePage({ config }: HomePageProps) {
  const { data: summary, isPending } = useAdminAnalyticsSummary()
  const homeConfig = applyAnalyticsSummary(config, summary ?? EMPTY_SUMMARY)
  const { home } = homeConfig

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <WelcomeHeader />
      {isPending ? (
        <HomePageSkeleton />
      ) : (
        <>
          <MetricCardsRow metrics={home.metrics} />
          <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <PrimaryPanelCard panel={home.primary} />
            </div>
            <div className="space-y-4">
              {home.side.map((card) => (
                <SideCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
