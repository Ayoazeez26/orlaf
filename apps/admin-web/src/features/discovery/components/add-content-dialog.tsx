import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { Plus, Search, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useProjectsQuery } from "@/features/projects/api/projects-hooks"
import type { DiscoveryRail } from "../types"
import { useModalShell } from "./use-modal-shell"

interface AddContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rail: DiscoveryRail | null
  onAddSeries?: (seriesId: string) => void
}

export function AddContentDialog({
  open,
  onOpenChange,
  rail,
  onAddSeries,
}: AddContentDialogProps) {
  const [search, setSearch] = useState("")
  const { data } = useProjectsQuery({ filter: "all", pageSize: 50, q: search })

  useEffect(() => {
    if (open) setSearch("")
  }, [open])

  useModalShell(open, onOpenChange)

  const existingIds = useMemo(
    () => new Set(rail?.items.map((item) => item.id) ?? []),
    [rail]
  )

  const series = (data?.items ?? []).filter((item) => !existingIds.has(item.id))

  if (!open || !rail) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-content-title"
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="add-content-title"
                className="font-semibold text-foreground text-lg"
              >
                Add content to &ldquo;{rail.title}&rdquo;
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Pick a series to place into this rail.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search series..."
              aria-label="Search series"
              className="pl-9"
            />
          </div>

          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {series.map((item) => (
              <li key={item.id}>
                <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
                  <div
                    className={cn(
                      "size-10 shrink-0 rounded-lg bg-gradient-to-br from-primary/25 to-primary/5"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {item.genre} · {item.episodeCount} eps
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Add ${item.title}`}
                    onClick={() => onAddSeries?.(item.id)}
                  >
                    <Plus className="size-4" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 border-border border-t px-6 py-4">
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
