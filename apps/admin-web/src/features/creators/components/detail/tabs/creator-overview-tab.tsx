import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import { AtSign, Calendar, MapPin, ShieldCheck } from "lucide-react"
import { useCreatorAnalyticsQuery } from "@/features/creators/api/creators-hooks"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { formatCreatorViews } from "../../../data/creator-details"
import type { CreatorDetail, TopProject } from "../../../types"

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

function topProjectsFromEpisodes(
  episodes: {
    series: string
    title: string
    views: number
  }[]
): TopProject[] {
  const bySeries = new Map<string, TopProject>()
  for (const episode of episodes) {
    const existing = bySeries.get(episode.series)
    if (existing) {
      existing.views += episode.views
    } else {
      bySeries.set(episode.series, {
        title: episode.series,
        duration: episode.title,
        views: episode.views,
      })
    }
  }
  return [...bySeries.values()].sort((a, b) => b.views - a.views).slice(0, 5)
}

export function CreatorOverviewTab({ creator }: { creator: CreatorDetail }) {
  const { data: analytics, isPending } = useCreatorAnalyticsQuery(creator.id)
  const topProjects = analytics
    ? topProjectsFromEpisodes(analytics.topEpisodes)
    : []

  const fields: InfoField[] = [
    { icon: AtSign, label: "Username", value: creator.username },
    { icon: Calendar, label: "Joined", value: creator.joined },
    { icon: ShieldCheck, label: "Role", value: creator.role },
    { icon: MapPin, label: "Location", value: creator.location },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="space-y-6 px-6">
          <h2 className="font-semibold text-foreground text-lg tracking-tight">
            Bio
          </h2>
          <p className="text-foreground text-sm leading-relaxed">
            {creator.bio}
          </p>

          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {fields.map((field) => (
              <InfoFieldRow key={field.label} {...field} />
            ))}
          </div>

          <div className="space-y-2.5">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {creator.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-muted px-3 py-1 font-medium text-foreground text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="space-y-5 px-6">
          <h2 className="font-semibold text-foreground text-lg tracking-tight">
            Top Performing Projects
          </h2>

          {isPending ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : topProjects.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No view data yet for this creator.
            </p>
          ) : (
            <ul className="space-y-4">
              {topProjects.map((project, index) => (
                <li key={project.title} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {project.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {project.duration} · {formatCreatorViews(project.views)}{" "}
                      views
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
