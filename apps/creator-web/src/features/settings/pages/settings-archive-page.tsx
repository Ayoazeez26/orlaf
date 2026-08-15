import type { ArchivedItem } from "@sable/contracts"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import {
  Film,
  Folder,
  Loader2,
  Megaphone,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useMemo, useState } from "react"
import { SettingsModalShell } from "../components/settings-modal-shell"
import { SettingsPageSkeleton } from "../components/settings-page-skeleton"
import { SettingsSectionCard } from "../components/settings-section-card"
import { toast, toastMutationError } from "@/lib/toast"
import {
  type ArchiveFilter,
  useArchive,
  useDeleteArchiveItem,
  useEmptyArchive,
  useRestoreArchiveItem,
} from "../hooks/use-archive"
import {
  archiveTypeLabel,
  formatArchivedAt,
  formatArchiveSize,
} from "../lib/format-archive"

const FILTER_TABS: Array<{ id: ArchiveFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "project", label: "Projects" },
  { id: "episode", label: "Episodes" },
  { id: "promotion", label: "Promotions" },
]

const ICON_MAP = {
  folder: Folder,
  film: Film,
  megaphone: Megaphone,
} as const

export function SettingsArchivePage() {
  const [filter, setFilter] = useState<ArchiveFilter>("all")
  const [emptyOpen, setEmptyOpen] = useState(false)
  const { data, isLoading, isError } = useArchive(filter)
  const restoreItem = useRestoreArchiveItem()
  const deleteItem = useDeleteArchiveItem()
  const emptyArchive = useEmptyArchive()

  const items = useMemo(() => data?.items ?? [], [data?.items])

  if (isLoading) {
    return <SettingsPageSkeleton />
  }

  if (isError || !data) {
    return (
      <p className="text-destructive text-sm">
        Could not load archive. Please try again.
      </p>
    )
  }

  async function handleEmptyArchive() {
    try {
      await emptyArchive.mutateAsync()
      toast.success("Archive emptied.")
      setEmptyOpen(false)
    } catch (error) {
      toastMutationError(error, "Unable to empty archive. Please try again.")
    }
  }

  return (
    <>
      <SettingsSectionCard
        title="Archive"
        description="Anything you archive lives here for 90 days, then auto-deletes. Restore to bring it back exactly as it was."
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTER_TABS.map((tab) => {
                const count =
                  tab.id === "all"
                    ? data.counts.all
                    : tab.id === "project"
                      ? data.counts.projects
                      : tab.id === "episode"
                        ? data.counts.episodes
                        : data.counts.promotions
                const isActive = filter === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 font-medium text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label} ({count})
                  </button>
                )
              })}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-destructive hover:text-destructive"
              disabled={data.counts.all === 0 || emptyArchive.isPending}
              onClick={() => setEmptyOpen(true)}
            >
              <Trash2 className="size-3.5" aria-hidden />
              Empty archive
            </Button>
          </div>

          <div className="divide-y rounded-xl border border-border">
            {filter === "promotion" ? (
              <p className="px-4 py-10 text-center text-muted-foreground text-sm">
                Promotions archive is coming soon.
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-10 text-center text-muted-foreground text-sm">
                No archived items in this category.
              </p>
            ) : (
              items.map((item) => (
                <ArchiveRow
                  key={item.id}
                  item={item}
                  onRestore={() =>
                    restoreItem.mutate(
                      {
                        type: item.type,
                        entityId: item.entityId,
                      },
                      {
                        onSuccess: () =>
                          toast.success(`"${item.title}" restored.`),
                        onError: (error) =>
                          toastMutationError(
                            error,
                            "Unable to restore this item."
                          ),
                      }
                    )
                  }
                  onDelete={() =>
                    deleteItem.mutate(
                      {
                        type: item.type,
                        entityId: item.entityId,
                      },
                      {
                        onSuccess: () =>
                          toast.success(`"${item.title}" deleted.`),
                        onError: (error) =>
                          toastMutationError(
                            error,
                            "Unable to delete this item."
                          ),
                      }
                    )
                  }
                  isRestoring={restoreItem.isPending}
                  isDeleting={deleteItem.isPending}
                />
              ))
            )}
          </div>
        </div>
      </SettingsSectionCard>

      <SettingsModalShell
        open={emptyOpen}
        onOpenChange={setEmptyOpen}
        title="Empty archive?"
        description="This permanently deletes every archived project and episode. This cannot be undone."
        footer={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEmptyOpen(false)}
              disabled={emptyArchive.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleEmptyArchive()}
              disabled={emptyArchive.isPending}
            >
              {emptyArchive.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Deleting…
                </>
              ) : (
                "Empty archive"
              )}
            </Button>
          </div>
        }
      >
        <p className="text-muted-foreground text-sm">
          {data.counts.all} item{data.counts.all === 1 ? "" : "s"} will be
          permanently removed.
        </p>
      </SettingsModalShell>
    </>
  )
}

function ArchiveRow({
  item,
  onRestore,
  onDelete,
  isRestoring,
  isDeleting,
}: {
  item: ArchivedItem
  onRestore: () => void
  onDelete: () => void
  isRestoring: boolean
  isDeleting: boolean
}) {
  const Icon = ICON_MAP[item.icon]
  const subtitle = [
    archiveTypeLabel(item.type),
    `Archived ${formatArchivedAt(item.archivedAt)}`,
    formatArchiveSize(item.sizeBytes),
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
          <Icon className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground text-sm">
            {item.seriesTitle && item.type === "episode"
              ? `${item.seriesTitle} · ${item.title}`
              : item.title}
          </p>
          <p className="truncate text-muted-foreground text-xs">{subtitle}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-lg"
          disabled={isRestoring || isDeleting}
          onClick={onRestore}
        >
          {isRestoring ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <RotateCcw className="size-3.5" aria-hidden />
          )}
          Restore
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          disabled={isRestoring || isDeleting}
          aria-label={`Delete ${item.title}`}
          onClick={onDelete}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Trash2 className="size-4" aria-hidden />
          )}
        </Button>
      </div>
    </div>
  )
}
