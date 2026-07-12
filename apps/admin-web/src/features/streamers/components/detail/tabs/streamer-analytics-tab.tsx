import { Clock, Flame, TrendingUp, Wallet } from "lucide-react"
import { MetricCardsRow } from "@/features/workspaces/components/home/metric-cards-row"
import type { MetricDef } from "@/features/workspaces/types"
import type { StreamerAnalytics } from "../../../types"
import { StreamerEpisodesByDayChart } from "../charts/streamer-episodes-by-day-chart"
import { StreamerGenreShareChart } from "../charts/streamer-genre-share-chart"
import { StreamerTopSeriesCard } from "../charts/streamer-top-series-card"
import { StreamerWatchHoursChart } from "../charts/streamer-watch-hours-chart"

interface StreamerAnalyticsTabProps {
  analytics: StreamerAnalytics
}

export function StreamerAnalyticsTab({ analytics }: StreamerAnalyticsTabProps) {
  const metrics: MetricDef[] = [
    {
      label: "Completion rate",
      value: `${analytics.completionRate}%`,
      icon: TrendingUp,
    },
    {
      label: "Avg session",
      value: `${analytics.avgSessionMinutes} min`,
      icon: Clock,
    },
    {
      label: "Peak watch hour",
      value: analytics.peakWatchHour,
      icon: Flame,
    },
    {
      label: "ARPU",
      value: `$${analytics.arpu.toFixed(2)}`,
      icon: Wallet,
    },
  ]

  return (
    <div className="space-y-6">
      <MetricCardsRow metrics={metrics} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <StreamerWatchHoursChart data={analytics.watchHoursByWeek} />
        <StreamerGenreShareChart data={analytics.genreShare} />
        <StreamerEpisodesByDayChart data={analytics.episodesByDay} />
        <StreamerTopSeriesCard items={analytics.topSeries} />
      </div>
    </div>
  )
}
