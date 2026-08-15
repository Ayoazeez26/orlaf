import { Link, useParams } from "@tanstack/react-router"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Loader2,
  MoreVertical,
  Play,
  Plus,
} from "lucide-react"
import { useState } from "react"
import { SettingsModalShell } from "@/features/settings/components/settings-modal-shell"
import { toast, toastMutationError } from "@/lib/toast"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import {
  useArchiveEpisode,
  useProject,
  useReorderEpisodes,
} from "../../hooks/use-project"
import type { EpisodeSummary } from "../../types"

function episodeStatusBadge(access: EpisodeSummary["access"]) {
  if (access === "free") {
    return {
      label: "Free",
      className:
        "border-[#2BBB7133] bg-[#2BBB7126] text-[#002C0F] dark:text-emerald-300",
    }
  }
  if (access === "coins") {
    return {
      label: "Coins",
      className: "border-amber-500/30 bg-amber-500/15 text-amber-800",
    }
  }
  return {
    label: "Premium",
    className: "border-primary/30 bg-primary/10 text-primary",
  }
}

export function ProjectEpisodesTab() {
  const { projectId } = useParams({ strict: false })
  const id = projectId ?? ""
  const { data: project } = useProject(id)
  const reorderEpisodes = useReorderEpisodes(id)
  const archiveEpisode = useArchiveEpisode(id)
  const [archiveTarget, setArchiveTarget] = useState<EpisodeSummary | null>(
    null
  )

  if (!project) return null

  const isReordering = reorderEpisodes.isPending
  const isArchiving = archiveEpisode.isPending

  async function moveEpisode(episodeId: string, direction: "up" | "down") {
    if (!project) return
    const ids = project.episodes.map((episode) => episode.id)
    const index = ids.indexOf(episodeId)
    if (index < 0) return

    const swapWith = direction === "up" ? index - 1 : index + 1
    if (swapWith < 0 || swapWith >= ids.length) return

    const currentId = ids[index]
    const swapId = ids[swapWith]
    if (!currentId || !swapId) return

    const moved = project.episodes[index]
    const displaced = project.episodes[swapWith]
    const fromNumber = index + 1
    const toNumber = swapWith + 1

    const next = [...ids]
    next[index] = swapId
    next[swapWith] = currentId
    try {
      await reorderEpisodes.mutateAsync(next)
      if (moved && displaced) {
        toast.success(
          `"${moved.title}" moved from Ep. ${fromNumber} to Ep. ${toNumber}. "${displaced.title}" is now Ep. ${fromNumber}.`,
          { duration: 5000 }
        )
      }
    } catch (error) {
      toastMutationError(error, "Unable to reorder episodes. Please try again.")
    }
  }

  async function handleArchive() {
    if (!archiveTarget) return
    try {
      await archiveEpisode.mutateAsync(archiveTarget.id)
      toast.success(`"${archiveTarget.title}" was archived.`)
      setArchiveTarget(null)
    } catch (error) {
      toastMutationError(
        error,
        "Unable to archive this episode. Please try again."
      )
    }
  }

  return (
    <div className={cn(FROSTED_CARD_SURFACE_CLASS, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-4 p-6">
        <div>
          <h2 className="font-semibold text-base text-text-strong">
            All Episodes
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            {project.episodes.length} episodes
          </p>
        </div>
        <Button asChild className="shrink-0 gap-2">
          <Link
            to="/dashboard/projects/new"
            search={{
              seriesId: project.id,
              step: "episodes",
              addEpisode: true,
            }}
          >
            <Plus className="size-4" aria-hidden />
            Add Episode
          </Link>
        </Button>
      </div>

      <div>
        {project.episodes.length === 0 ? (
          <p className="border-border border-t px-6 py-8 text-muted-foreground text-sm">
            No episodes yet. Add your first episode to get started.
          </p>
        ) : null}

        {project.episodes.map((episode, index) => {
          const badge = episodeStatusBadge(episode.access)

          return (
            <div
              key={episode.id}
              className="flex items-center gap-4 border-border border-t px-6 py-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EDEBFF] text-primary">
                <Play className="size-4" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-sm text-text-strong">
                    Ep. {episode.number} — {episode.title}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", badge.className)}
                  >
                    {badge.label}
                  </Badge>
                </div>
                <p className="mt-1 text-muted-foreground text-sm">
                  {episode.duration} · {episode.views} views
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Move episode ${episode.number} up`}
                  disabled={isReordering || index === 0}
                  onClick={() => void moveEpisode(episode.id, "up")}
                >
                  <ArrowUp className="size-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Move episode ${episode.number} down`}
                  disabled={
                    isReordering || index === project.episodes.length - 1
                  }
                  onClick={() => void moveEpisode(episode.id, "down")}
                >
                  <ArrowDown className="size-4" aria-hidden />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Actions for episode ${episode.number}`}
                      disabled={isArchiving}
                    >
                      <MoreVertical className="size-4" aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-max">
                    <DropdownMenuItem
                      variant="destructive"
                      className="whitespace-nowrap"
                      onClick={() => setArchiveTarget(episode)}
                    >
                      <Archive className="size-4" aria-hidden />
                      Archive episode
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>

      <SettingsModalShell
        open={archiveTarget !== null}
        onOpenChange={(open) => {
          if (!open && !isArchiving) setArchiveTarget(null)
        }}
        title="Archive episode?"
        description={
          archiveTarget
            ? `"${archiveTarget.title}" will be hidden from this series. You can restore it from Settings → Archive.`
            : undefined
        }
        footer={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setArchiveTarget(null)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleArchive()}
              disabled={isArchiving}
            >
              {isArchiving ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Archiving…
                </>
              ) : (
                "Archive episode"
              )}
            </Button>
          </div>
        }
      >
        <p className="text-muted-foreground text-sm">
          The episode stays in your archive until you restore or permanently
          delete it.
        </p>
      </SettingsModalShell>
    </div>
  )
}
