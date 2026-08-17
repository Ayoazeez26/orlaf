import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  GripVertical,
  Layers,
  Pencil,
  Star,
  Trash2,
  UserRound,
  Users,
} from "lucide-react"
import { RAIL_AUDIENCE_LABEL } from "../constants"
import type { DiscoveryRail } from "../types"
import { HeroBadge, RailStatusBadge } from "./discovery-badges"
import { AddContentCard, DiscoveryContentCard } from "./discovery-content-card"

interface DiscoveryRailCardProps {
  rail: DiscoveryRail
  onAddContent?: (rail: DiscoveryRail) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  onToggleVisible?: () => void
  onToggleLive?: () => void
  onDelete?: () => void
  onEdit?: () => void
  onRemoveItem?: (seriesId: string) => void
}

export function DiscoveryRailCard({
  rail,
  onAddContent,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  onToggleVisible,
  onToggleLive,
  onDelete,
  onEdit,
  onRemoveItem,
}: DiscoveryRailCardProps) {
  const AudienceIcon = rail.audience === "new-users" ? UserRound : Users

  return (
    <div className="rounded-[16px] border bg-surface-frosted p-4 backdrop-blur-[24px] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            className="mt-1 shrink-0 cursor-grab text-muted-foreground hover:text-foreground"
            aria-label={`Reorder ${rail.title}`}
          >
            <GripVertical className="size-4" aria-hidden />
          </button>

          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {rail.type === "hero" ? (
                <Star className="size-4 text-primary" aria-hidden />
              ) : (
                <Layers className="size-4 text-muted-foreground" aria-hidden />
              )}
              <h3 className="font-semibold text-foreground text-sm">
                {rail.title}
              </h3>
              <button
                type="button"
                onClick={onToggleLive}
                title={
                  rail.status === "live"
                    ? "Set rail to draft"
                    : "Set rail live for catalog"
                }
              >
                <RailStatusBadge status={rail.status} />
              </button>
              {rail.type === "hero" ? <HeroBadge /> : null}
              {rail.collectionKey ? (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
                  catalog:{rail.collectionKey}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
              <span>Position {rail.position}</span>
              <span className="inline-flex items-center gap-1">
                <AudienceIcon className="size-3.5" aria-hidden />
                {RAIL_AUDIENCE_LABEL[rail.audience]}
              </span>
              <span className="inline-flex items-center gap-1">
                <Layers className="size-3.5" aria-hidden />
                {rail.items.length} items
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 self-end sm:self-start">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Move rail up"
            disabled={!canMoveUp}
            onClick={onMoveUp}
          >
            <ArrowUp className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Move rail down"
            disabled={!canMoveDown}
            onClick={onMoveDown}
          >
            <ArrowDown className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={rail.isVisible ? "Hide rail" : "Show rail"}
            onClick={onToggleVisible}
          >
            {rail.isVisible ? (
              <Eye className="size-4" aria-hidden />
            ) : (
              <EyeOff className="size-4" aria-hidden />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Edit rail"
            onClick={onEdit}
          >
            <Pencil className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Delete rail"
            onClick={onDelete}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 flex gap-3 overflow-x-auto pb-1",
          !rail.isVisible && "opacity-60"
        )}
      >
        {rail.items.map((item) => (
          <button
            key={`${rail.id}-${item.id}`}
            type="button"
            className="text-left"
            onClick={() => onRemoveItem?.(item.id)}
            title="Remove from rail"
          >
            <DiscoveryContentCard item={item} />
          </button>
        ))}
        <AddContentCard onClick={() => onAddContent?.(rail)} />
      </div>
    </div>
  )
}
