import { useParams } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { DollarSign, Eye, Lock, MoreVertical, Unlock } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import { useProject } from "../../hooks/use-project"

export function ProjectEpisodesTab() {
  const { projectId } = useParams({ strict: false })
  const { data: project } = useProject(projectId ?? "")

  if (!project) return null

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        {project.episodes.length} episodes
      </p>
      <div className="space-y-3">
        {project.episodes.map((episode) => (
          <Card key={episode.id} className={cn(FROSTED_CARD_SURFACE_CLASS, "py-0")}>
            <CardContent className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-background font-semibold text-muted-foreground">
                  {episode.number}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground text-sm">
                      {episode.title}
                    </p>
                    {episode.locked ? (
                      <Lock
                        className="size-3.5 text-primary"
                        aria-label="Locked"
                      />
                    ) : (
                      <Unlock
                        className="size-3.5 text-emerald-600"
                        aria-label="Unlocked"
                      />
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Ep {episode.number} · {episode.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:shrink-0">
                <Stat icon={Eye} value={episode.views} />
                <Stat icon={DollarSign} value={episode.revenue ?? "0"} />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Episode actions"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Stat({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string
}) {
  return (
    <div
      className={cn("flex items-center gap-1.5 text-muted-foreground text-sm")}
    >
      <Icon className="size-4" aria-hidden />
      <span>{value}</span>
    </div>
  )
}
