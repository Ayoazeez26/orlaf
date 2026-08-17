import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  Clapperboard,
  Eye,
  Globe,
  Percent,
  Play,
  Tag,
  Users,
} from "lucide-react"
import { useProjectAnalyticsQuery } from "@/features/projects/api/projects-hooks"
import { MetricCardsRow } from "@/features/workspaces/components/home/metric-cards-row"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { MetricDef } from "@/features/workspaces/types"
import { formatProjectViews } from "../../../data/project-details"
import type { ProjectDetail } from "../../../types"

interface InfoField {
  icon: LucideIcon
  label: string
  value: string
}

function InfoFieldRow({ icon: Icon, label, value }: InfoField) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </span>
      <div className="min-w-0 space-y-0.5">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-medium text-foreground text-sm">{value}</p>
      </div>
    </div>
  )
}

function formatWatchTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatCompactCount(value: number): string {
  if (value < 1000) return String(Math.round(value))
  if (value < 10_000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`
  }
  if (value < 1_000_000) return `${Math.round(value / 1000)}K`
  return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`
}

export function ProjectOverviewTab({ project }: { project: ProjectDetail }) {
  const { data: analytics, isPending } = useProjectAnalyticsQuery(project.id)

  const metrics: MetricDef[] = analytics
    ? [
        {
          label: "Total Views",
          value: formatCompactCount(analytics.kpis.total_views.value),
          icon: Eye,
        },
        {
          label: "Unique Viewers",
          value: formatCompactCount(analytics.kpis.unique_viewers.value),
          icon: Users,
        },
        {
          label: "Avg Watch Time",
          value: formatWatchTime(analytics.kpis.avg_watch_seconds.value),
          icon: Play,
        },
        {
          label: "Completion Rate",
          value: `${(analytics.kpis.completion_rate.value * 100).toFixed(1)}%`,
          icon: Percent,
        },
      ]
    : [
        { label: "Total Views", value: isPending ? "…" : "0", icon: Eye },
        { label: "Unique Viewers", value: isPending ? "…" : "0", icon: Users },
        {
          label: "Avg Watch Time",
          value: isPending ? "…" : "0:00",
          icon: Play,
        },
        {
          label: "Completion Rate",
          value: isPending ? "…" : "0%",
          icon: Percent,
        },
      ]

  const topEpisodes =
    analytics?.top_episodes.map((episode) => ({
      rank: episode.rank,
      title: episode.episode_title,
      duration: "—",
      views: episode.views,
    })) ?? []

  const fields: InfoField[] = [
    { icon: Tag, label: "Genre", value: project.genre },
    { icon: Globe, label: "Language", value: project.language },
    { icon: Calendar, label: "Created", value: project.created },
    {
      icon: Clapperboard,
      label: "Episodes",
      value: String(project.episodeCount),
    },
  ]

  return (
    <div className="space-y-6">
      <MetricCardsRow metrics={metrics} />

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
          <CardContent className="space-y-6 px-6">
            <h2 className="font-semibold text-foreground text-lg tracking-tight">
              About
            </h2>
            <p className="text-foreground text-sm leading-relaxed">
              {project.description || "No synopsis yet."}
            </p>

            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {fields.map((field) => (
                <InfoFieldRow key={field.label} {...field} />
              ))}
            </div>

            <div className="space-y-3 border-border border-t pt-5">
              <h3 className="font-semibold text-foreground text-sm">Creator</h3>
              <div className="flex items-center gap-3">
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className="bg-primary/15 font-medium text-primary text-sm">
                    {project.creatorInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {project.creatorName}
                  </p>
                  <p className="truncate text-muted-foreground text-xs">
                    {project.creatorEmail}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
          <CardContent className="space-y-5 px-6">
            <h2 className="font-semibold text-foreground text-lg tracking-tight">
              Top Performing Episodes
            </h2>

            {isPending ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : topEpisodes.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No episode view data yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {topEpisodes.map((episode) => (
                  <li key={episode.title} className="flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
                      {episode.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {episode.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatProjectViews(episode.views)} views
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
