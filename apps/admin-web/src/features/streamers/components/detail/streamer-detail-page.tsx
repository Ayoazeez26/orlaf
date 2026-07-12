import { Clock, Coins, Eye, Wallet } from "lucide-react"
import { useState } from "react"
import { MetricCardsRow } from "@/features/workspaces/components/home/metric-cards-row"
import type { MetricDef, WorkspaceRoleId } from "@/features/workspaces/types"
import type { StreamerDetail } from "../../types"
import { StreamerDetailHeader } from "./streamer-detail-header"
import {
  type StreamerDetailTab,
  StreamerDetailTabs,
} from "./streamer-detail-tabs"
import { StreamerProfileCard } from "./streamer-profile-card"
import { StreamerRecentlyWatchedCard } from "./streamer-recently-watched-card"
import { StreamerAnalyticsTab } from "./tabs/streamer-analytics-tab"
import { StreamerBillingTab } from "./tabs/streamer-billing-tab"
import { StreamerWatchHistoryTab } from "./tabs/streamer-watch-history-tab"

interface StreamerDetailPageProps {
  streamer: StreamerDetail
  role: WorkspaceRoleId
}

export function StreamerDetailPage({
  streamer,
  role,
}: StreamerDetailPageProps) {
  const [activeTab, setActiveTab] = useState<StreamerDetailTab>("overview")

  const overviewMetrics: MetricDef[] = [
    { label: "Watch hours", value: `${streamer.watchHours} h`, icon: Clock },
    {
      label: "Episodes watched",
      value: streamer.episodesWatched.toLocaleString(),
      icon: Eye,
    },
    {
      label: "Coins balance",
      value: streamer.coinsBalance.toLocaleString(),
      icon: Coins,
    },
    {
      label: "Lifetime spend",
      value: `$${streamer.lifetimeSpend.toFixed(2)}`,
      icon: Wallet,
    },
  ]

  return (
    <div className="space-y-6">
      <StreamerDetailHeader streamer={streamer} role={role} />

      <StreamerDetailTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" ? (
        <>
          <MetricCardsRow metrics={overviewMetrics} />
          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <StreamerProfileCard streamer={streamer} />
            <StreamerRecentlyWatchedCard items={streamer.recentlyWatched} />
          </div>
        </>
      ) : null}

      {activeTab === "watch-history" ? (
        <StreamerWatchHistoryTab items={streamer.watchHistory} />
      ) : null}

      {activeTab === "billing" ? (
        <StreamerBillingTab
          coinsBalance={streamer.coinsBalance}
          lifetimeSpend={streamer.lifetimeSpend}
          billing={streamer.billing}
        />
      ) : null}

      {activeTab === "analytics" ? (
        <StreamerAnalyticsTab analytics={streamer.analytics} />
      ) : null}
    </div>
  )
}
