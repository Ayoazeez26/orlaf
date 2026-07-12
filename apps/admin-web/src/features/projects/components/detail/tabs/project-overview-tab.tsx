import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  Clapperboard,
  Eye,
  FolderOpen,
  Globe,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react"
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

const OVERVIEW_METRICS: MetricDef[] = [
  { label: "Total Users", value: "2,487", icon: Users },
  { label: "Total Content", value: "1,204", icon: TrendingUp },
  { label: "Platform Views", value: "88.2M", icon: Eye },
  { label: "Active Creators", value: "342", icon: FolderOpen },
]

export function ProjectOverviewTab({ project }: { project: ProjectDetail }) {
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
      <MetricCardsRow metrics={OVERVIEW_METRICS} />

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
          <CardContent className="space-y-6 px-6">
            <h2 className="font-semibold text-foreground text-lg tracking-tight">
              About
            </h2>
            <p className="text-foreground text-sm leading-relaxed">
              {project.description}
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

            <ul className="space-y-4">
              {project.topEpisodes.map((episode) => (
                <li key={episode.title} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
                    {episode.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {episode.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {episode.duration} · {formatProjectViews(episode.views)}{" "}
                      views
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
