import type { ForYouPreviewItem } from "@sable/contracts"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Search, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { SeriesPoster } from "./series-poster"
import { useModalShell } from "./use-modal-shell"

export interface PinSeriesValues {
  seriesId: string
  position: number
  endsAt: string | null
}

interface PinSeriesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Series that can play in the feed. */
  candidates: ForYouPreviewItem[]
  feedLimit: number
  /** Opens the dialog with this series chosen, to pin it or edit its pin. */
  initialSeriesId?: string | null
  isPending?: boolean
  onConfirm: (values: PinSeriesValues) => void
}

/** `datetime-local` wants local wall-clock time without a zone. */
function toLocalInputValue(iso: string): string {
  const date = new Date(iso)
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export function PinSeriesDialog({
  open,
  onOpenChange,
  candidates,
  feedLimit,
  initialSeriesId,
  isPending,
  onConfirm,
}: PinSeriesDialogProps) {
  const [search, setSearch] = useState("")
  const [seriesId, setSeriesId] = useState<string | null>(null)
  const [position, setPosition] = useState("1")
  const [endsAt, setEndsAt] = useState("")

  useEffect(() => {
    if (!open) return
    const initial = candidates.find((item) => item.seriesId === initialSeriesId)
    setSearch("")
    setSeriesId(initial?.seriesId ?? null)
    setPosition(String(initial?.pin?.position ?? 1))
    setEndsAt(initial?.pin?.endsAt ? toLocalInputValue(initial.pin.endsAt) : "")
  }, [open, initialSeriesId, candidates])

  useModalShell(open, onOpenChange)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return candidates
    return candidates.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.creatorName?.toLowerCase().includes(query)
    )
  }, [candidates, search])

  if (!open) return null

  const parsedPosition = Number(position)
  const positionValid =
    Number.isInteger(parsedPosition) &&
    parsedPosition >= 1 &&
    parsedPosition <= feedLimit
  const endsAtDate = endsAt ? new Date(endsAt) : null
  const endsAtValid = !endsAtDate || endsAtDate.getTime() > Date.now()
  const canConfirm = Boolean(seriesId) && positionValid && endsAtValid

  function handleConfirm() {
    if (!seriesId || !canConfirm) return
    onConfirm({
      seriesId,
      position: parsedPosition,
      endsAt: endsAtDate ? endsAtDate.toISOString() : null,
    })
  }

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
        aria-labelledby="pin-series-title"
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="pin-series-title"
                className="font-semibold text-foreground text-lg"
              >
                Pin a series to For You
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Pinned series hold their slot; the ranking fills the rest.
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
              placeholder="Search playable series..."
              aria-label="Search playable series"
              className="pl-9"
            />
          </div>

          <ul className="max-h-60 space-y-2 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="py-6 text-center text-muted-foreground text-sm">
                No playable series match.
              </li>
            ) : (
              filtered.map((item) => {
                const isSelected = item.seriesId === seriesId
                return (
                  <li key={item.seriesId}>
                    <button
                      type="button"
                      onClick={() => setSeriesId(item.seriesId)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/40"
                      )}
                    >
                      <SeriesPoster posterUrl={item.posterUrl} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground text-sm">
                          {item.title}
                        </p>
                        <p className="truncate text-muted-foreground text-xs">
                          Ranked #{item.rank}
                          {item.pin ? ` · pinned at #${item.pin.position}` : ""}
                        </p>
                      </div>
                      {isSelected ? (
                        <Check className="size-4 text-primary" aria-hidden />
                      ) : null}
                    </button>
                  </li>
                )
              })
            )}
          </ul>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pin-position">Position</Label>
              <Input
                id="pin-position"
                type="number"
                min={1}
                max={feedLimit}
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                aria-invalid={!positionValid}
              />
              <p className="text-muted-foreground text-xs">
                1 is the first video. Max {feedLimit}.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin-ends-at">Ends (optional)</Label>
              <Input
                id="pin-ends-at"
                type="datetime-local"
                value={endsAt}
                onChange={(event) => setEndsAt(event.target.value)}
                aria-invalid={!endsAtValid}
              />
              <p className="text-muted-foreground text-xs">
                {endsAtValid
                  ? "Leave empty to keep it pinned."
                  : "Pick a time in the future."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-border border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || isPending}
          >
            {isPending ? "Pinning…" : "Pin series"}
          </Button>
        </div>
      </div>
    </div>
  )
}
