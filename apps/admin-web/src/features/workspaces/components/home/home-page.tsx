import type { WorkspaceConfig } from "../../types"
import { MetricCardsRow } from "./metric-cards-row"
import { PrimaryPanelCard } from "./primary-panel-card"
import { SideCard } from "./side-card"
import { WelcomeHeader } from "./welcome-header"

interface HomePageProps {
  config: WorkspaceConfig
}

export function HomePage({ config }: HomePageProps) {
  const { home } = config

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <WelcomeHeader />
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
    </div>
  )
}
