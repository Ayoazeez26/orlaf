import type {
  ForYouHiddenItem,
  ForYouIneligibleItem,
  ForYouPin,
  ForYouPreviewItem,
} from "@sable/contracts"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  RefreshCw,
} from "lucide-react"
import { useMemo, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useClearForYouOverride,
  useForYouPreviewQuery,
  useSetForYouOverride,
} from "../api/discovery-hooks"
import { PinSeriesDialog, type PinSeriesValues } from "./pin-series-dialog"
import { SeriesPoster } from "./series-poster"

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
})

function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

function pinLabel(pin: ForYouPin): string {
  return pin.endsAt
    ? `Pinned #${pin.position} until ${formatDate(pin.endsAt)}`
    : `Pinned #${pin.position}`
}

function matches(title: string, query: string): boolean {
  return !query || title.toLowerCase().includes(query)
}

export function ForYouRankingPanel({ search }: { search: string }) {
  const { data, isLoading, isFetching, refetch } = useForYouPreviewQuery()
  const setOverride = useSetForYouOverride()
  const clearOverride = useClearForYouOverride()
  const [pinDialogOpen, setPinDialogOpen] = useState(false)
  const [pinSeriesId, setPinSeriesId] = useState<string | null>(null)
  const [showBelowCut, setShowBelowCut] = useState(false)

  const query = search.trim().toLowerCase()
  const items = data?.items ?? []
  const feedLimit = data?.feedLimit ?? 0

  const { inFeed, belowCut } = useMemo(() => {
    const visible = items.filter((item) => matches(item.title, query))
    return {
      inFeed: visible.filter((item) => item.inFeed),
      belowCut: visible.filter((item) => !item.inFeed),
    }
  }, [items, query])
  const hidden = (data?.hidden ?? []).filter((item) =>
    matches(item.title, query)
  )
  const ineligible = (data?.ineligible ?? []).filter((item) =>
    matches(item.title, query)
  )

  function openPinDialog(seriesId: string | null) {
    setPinSeriesId(seriesId)
    setPinDialogOpen(true)
  }

  async function handlePin(values: PinSeriesValues) {
    try {
      await setOverride.mutateAsync({
        seriesId: values.seriesId,
        body: {
          mode: "pin",
          position: values.position,
          endsAt: values.endsAt,
        },
      })
      toast.success(`Pinned to For You #${values.position}.`)
      setPinDialogOpen(false)
    } catch (error) {
      toastMutationError(error, "Unable to pin series.")
    }
  }

  async function handleHide(seriesId: string, title: string) {
    try {
      await setOverride.mutateAsync({ seriesId, body: { mode: "hide" } })
      toast.success(`${title} is hidden from For You.`)
    } catch (error) {
      toastMutationError(error, "Unable to hide series.")
    }
  }

  async function handleClear(seriesId: string, message: string) {
    try {
      await clearOverride.mutateAsync(seriesId)
      toast.success(message)
    } catch (error) {
      toastMutationError(error, "Unable to update For You.")
    }
  }

  const isMutating = setOverride.isPending || clearOverride.isPending

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center text-muted-foreground text-sm">
        Loading the live ranking…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold text-base text-foreground">
            Live ranking
          </h2>
          <p className="mt-0.5 text-muted-foreground text-sm">
            The For You feed in the order the app plays it. The top {feedLimit}{" "}
            reach the app.
            {data ? ` Updated ${formatDate(data.generatedAt)}.` : null}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn("size-4", isFetching && "animate-spin")}
              aria-hidden
            />
            Refresh
          </Button>
          <Button
            type="button"
            size="sm"
            className="gap-2"
            onClick={() => openPinDialog(null)}
            disabled={items.length === 0}
          >
            <Pin className="size-4" aria-hidden />
            Pin a series
          </Button>
        </div>
      </div>

      {inFeed.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center rounded-[16px] border border-dashed text-center text-muted-foreground text-sm">
          {query
            ? "No series in the feed match your search."
            : "Nothing can play in For You yet. Series need a trailer or a free, ready episode."}
        </div>
      ) : (
        <ol className="space-y-2">
          {inFeed.map((item) => (
            <RankingRow
              key={item.seriesId}
              item={item}
              disabled={isMutating}
              onPin={() => openPinDialog(item.seriesId)}
              onUnpin={() =>
                handleClear(item.seriesId, `${item.title} is no longer pinned.`)
              }
              onHide={() => handleHide(item.seriesId, item.title)}
            />
          ))}
        </ol>
      )}

      {belowCut.length > 0 ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowBelowCut((value) => !value)}
            className="inline-flex items-center gap-1.5 font-medium text-muted-foreground text-sm hover:text-foreground"
          >
            {showBelowCut ? (
              <ChevronUp className="size-4" aria-hidden />
            ) : (
              <ChevronDown className="size-4" aria-hidden />
            )}
            {belowCut.length} more below the top {feedLimit} (not sent to the
            app)
          </button>
          {showBelowCut ? (
            <ol className="space-y-2 opacity-70">
              {belowCut.map((item) => (
                <RankingRow
                  key={item.seriesId}
                  item={item}
                  disabled={isMutating}
                  onPin={() => openPinDialog(item.seriesId)}
                  onUnpin={() =>
                    handleClear(
                      item.seriesId,
                      `${item.title} is no longer pinned.`
                    )
                  }
                  onHide={() => handleHide(item.seriesId, item.title)}
                />
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}

      <HiddenSection
        items={hidden}
        disabled={isMutating}
        onUnhide={(item) =>
          handleClear(item.seriesId, `${item.title} is back in For You.`)
        }
      />

      <IneligibleSection
        items={ineligible}
        disabled={isMutating}
        onUnpin={(item) =>
          handleClear(item.seriesId, `${item.title} is no longer pinned.`)
        }
      />

      <PinSeriesDialog
        open={pinDialogOpen}
        onOpenChange={setPinDialogOpen}
        candidates={items}
        feedLimit={feedLimit}
        initialSeriesId={pinSeriesId}
        isPending={setOverride.isPending}
        onConfirm={(values) => void handlePin(values)}
      />
    </div>
  )
}

function RankingRow({
  item,
  disabled,
  onPin,
  onUnpin,
  onHide,
}: {
  item: ForYouPreviewItem
  disabled: boolean
  onPin: () => void
  onUnpin: () => void
  onHide: () => void
}) {
  const { score } = item
  const parts = [
    { label: "Views", value: score.views },
    { label: "Likes", value: score.likes },
    { label: "Shares", value: score.shares },
    { label: "Comments", value: score.comments },
    { label: "Newness", value: score.recencyBoost },
  ]

  return (
    <li className="flex flex-col gap-3 rounded-[16px] border bg-surface-frosted p-3 backdrop-blur-[24px] sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="w-8 shrink-0 text-center font-semibold text-foreground text-sm tabular-nums">
          {item.rank}
        </span>
        <SeriesPoster posterUrl={item.posterUrl} />
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium text-foreground text-sm">
              {item.title}
            </p>
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 font-medium text-[11px] text-muted-foreground">
              {item.kind === "trailer"
                ? "Trailer"
                : `Episode${item.episodeTitle ? `: ${item.episodeTitle}` : ""}`}
            </span>
            {item.pin ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-[11px] text-primary">
                <Pin className="size-3" aria-hidden />
                {pinLabel(item.pin)}
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs">
            {item.creatorName ? <span>{item.creatorName}</span> : null}
            <span className="font-medium text-foreground tabular-nums">
              Score {score.total.toLocaleString()}
            </span>
            {parts
              .filter((part) => part.value > 0)
              .map((part) => (
                <span key={part.label} className="tabular-nums">
                  {part.label} +{part.value.toLocaleString()}
                </span>
              ))}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 self-end sm:self-center">
        {item.pin ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onPin}
              disabled={disabled}
            >
              Edit pin
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={onUnpin}
              disabled={disabled}
            >
              <PinOff className="size-4" aria-hidden />
              Unpin
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={onPin}
            disabled={disabled}
          >
            <Pin className="size-4" aria-hidden />
            Pin
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={onHide}
          disabled={disabled}
        >
          <EyeOff className="size-4" aria-hidden />
          Hide
        </Button>
      </div>
    </li>
  )
}

function SectionHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      <p className="mt-0.5 text-muted-foreground text-xs">{description}</p>
    </div>
  )
}

function HiddenSection({
  items,
  disabled,
  onUnhide,
}: {
  items: ForYouHiddenItem[]
  disabled: boolean
  onUnhide: (item: ForYouHiddenItem) => void
}) {
  if (items.length === 0) return null

  return (
    <section className="space-y-3 border-border border-t pt-5">
      <SectionHeading
        title={`Hidden (${items.length})`}
        description="Kept out of For You until you unhide them or the end date passes."
      />
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.seriesId}
            className="flex items-center gap-3 rounded-[16px] border p-3"
          >
            <SeriesPoster posterUrl={item.posterUrl} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground text-sm">
                {item.title}
              </p>
              <p className="text-muted-foreground text-xs">
                {item.endsAt
                  ? `Hidden until ${formatDate(item.endsAt)}`
                  : "Hidden indefinitely"}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => onUnhide(item)}
              disabled={disabled}
            >
              <Eye className="size-4" aria-hidden />
              Unhide
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function IneligibleSection({
  items,
  disabled,
  onUnpin,
}: {
  items: ForYouIneligibleItem[]
  disabled: boolean
  onUnpin: (item: ForYouIneligibleItem) => void
}) {
  if (items.length === 0) return null

  return (
    <section className="space-y-3 border-border border-t pt-5">
      <SectionHeading
        title={`Not eligible (${items.length})`}
        description="Published series that can't play in For You yet."
      />
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.seriesId}
            className="flex items-center gap-3 rounded-[16px] border p-3"
          >
            <SeriesPoster posterUrl={item.posterUrl} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground text-sm">
                {item.title}
              </p>
              <p className="text-muted-foreground text-xs">
                {item.reason}
                {item.pin
                  ? ` · ${pinLabel(item.pin)}, but it can't play so the pin has no effect`
                  : ""}
              </p>
            </div>
            {item.pin ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => onUnpin(item)}
                disabled={disabled}
              >
                <PinOff className="size-4" aria-hidden />
                Unpin
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
