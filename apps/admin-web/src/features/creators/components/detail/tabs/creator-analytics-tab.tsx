import { Clock, Eye, Percent, Users } from "lucide-react"
import { useCreatorAnalyticsQuery } from "@/features/creators/api/creators-hooks"
import { MetricCardsRow } from "@/features/workspaces/components/home/metric-cards-row"
import { AnalyticsTabSkeleton } from "@/features/workspaces/components/page-skeletons"
import type { MetricDef } from "@/features/workspaces/types"
import { formatCreatorViews } from "../../../data/creator-details"
import { CreatorDevicesChart } from "../charts/creator-devices-chart"
import { CreatorEngagementChart } from "../charts/creator-engagement-chart"
import { CreatorTopEpisodesCard } from "../charts/creator-top-episodes-card"
import { CreatorViewershipChart } from "../charts/creator-viewership-chart"

interface CreatorAnalyticsTabProps {
  creatorId: string
}

export function CreatorAnalyticsTab({ creatorId }: CreatorAnalyticsTabProps) {
  const {
    data: analytics,
    isPending,
    isError,
  } = useCreatorAnalyticsQuery(creatorId)

  if (isPending) {
    return <AnalyticsTabSkeleton />
  }

  if (isError || !analytics) {
    return (
      <p className="text-destructive text-sm">
        Could not load analytics for this creator.
      </p>
    )
  }

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
      label: "Completion",
      value: `${(analytics.completionRate * 100).toFixed(1)}%`,
      icon: Percent,
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
    </div>
  )
}
