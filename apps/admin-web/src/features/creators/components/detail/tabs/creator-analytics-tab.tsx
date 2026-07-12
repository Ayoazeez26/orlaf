import { Clock, Eye, TrendingUp, Users } from "lucide-react"
import { MetricCardsRow } from "@/features/workspaces/components/home/metric-cards-row"
import type { MetricDef } from "@/features/workspaces/types"
import {
  formatCreatorEarnings,
  formatCreatorViews,
} from "../../../data/creator-details"
import type { CreatorAnalytics } from "../../../types"
import { CreatorAudienceCountryCard } from "../charts/creator-audience-country-card"
import { CreatorDevicesChart } from "../charts/creator-devices-chart"
import { CreatorEngagementChart } from "../charts/creator-engagement-chart"
import { CreatorTopEpisodesCard } from "../charts/creator-top-episodes-card"
import { CreatorViewershipChart } from "../charts/creator-viewership-chart"

interface CreatorAnalyticsTabProps {
  analytics: CreatorAnalytics
}

export function CreatorAnalyticsTab({ analytics }: CreatorAnalyticsTabProps) {
  const metrics: MetricDef[] = [
    {
      label: "Total views",
      value: formatCreatorViews(analytics.totalViews),
      icon: Eye,
    },
    {
      label: "Unique viewers",
      value: formatCreatorViews(analytics.uniqueViewers),
      icon: Users,
    },
    {
      label: "Avg watch time",
      value: analytics.avgWatchTime,
      icon: Clock,
    },
    {
      label: "Total earnings",
      value: formatCreatorEarnings(analytics.totalEarnings),
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      <MetricCardsRow metrics={metrics} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <CreatorViewershipChart data={analytics.viewershipTrend} />
        <CreatorDevicesChart data={analytics.deviceShare} />
        <CreatorEngagementChart data={analytics.engagementByDay} />
        <CreatorTopEpisodesCard episodes={analytics.topEpisodes} />
      </div>

      <CreatorAudienceCountryCard countries={analytics.audienceByCountry} />
    </div>
  )
}
