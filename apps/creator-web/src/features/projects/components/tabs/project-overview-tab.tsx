import { useParams } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Calendar, Clapperboard, Globe, Tag } from "lucide-react"
import { AnalyticsMetricCard } from "@/features/analytics/components/shared/analytics-metric-card"
import { DEFAULT_ANALYTICS_DATE_RANGE } from "@/features/analytics/constants"
import { useAnalyticsDashboard } from "@/features/analytics/hooks/use-analytics-dashboard"
import { formatCompactCount } from "@/features/analytics/lib/map-analytics-overview"
import { MetricCardsSkeleton } from "@/features/dashboard/components/home/dashboard-home-skeleton"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import { useProject } from "../../hooks/use-project"

export function ProjectOverviewTab() {
  const { projectId } = useParams({ strict: false })
  const { data: project } = useProject(projectId ?? "")
  const { data: analytics, isPending: isAnalyticsPending } =
    useAnalyticsDashboard(DEFAULT_ANALYTICS_DATE_RANGE, projectId)

  if (!project) return null

  const viewsByEpisode = new Map(
    (analytics?.episodeViews ?? []).map((row) => [row.episodeId, row.views])
  )

  return (
    <div className="space-y-6">
      {isAnalyticsPending ? <MetricCardsSkeleton /> : null}
      {!isAnalyticsPending && analytics ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {analytics.kpis.slice(0, 4).map((kpi) => (
            <AnalyticsMetricCard key={kpi.label} kpi={kpi} />
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          className={cn(FROSTED_CARD_SURFACE_CLASS, "gap-2 py-6 lg:col-span-2")}
        >
          <CardHeader className="">
            <p className="font-semibold text-foreground text-sm">About</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {project.description}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <MetadataItem
                icon={Tag}
                label="Genre"
                value={project.genre ?? "—"}
              />
              <MetadataItem
                icon={Globe}
                label="Language"
                value={project.language ?? "—"}
              />
              <MetadataItem
                icon={Calendar}
                label="Created"
                value={project.createdAt}
              />
              <MetadataItem
                icon={Clapperboard}
                label="Episodes"
                value={String(project.episodeCount)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border bg-muted/50 px-3 py-1 text-muted-foreground text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
          <CardHeader className="pb-2">
            <p className="font-semibold text-foreground text-sm">
              Recent Episodes
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.recentEpisodes.map((episode) => (
              <div key={episode.id} className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                  {episode.number}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground text-sm">
                    {episode.title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {episode.duration} ·{" "}
                    {formatCompactCount(viewsByEpisode.get(episode.id) ?? 0)}{" "}
                    views
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetadataItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background">
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground text-sm">{value}</p>
      </div>
    </div>
  )
}
