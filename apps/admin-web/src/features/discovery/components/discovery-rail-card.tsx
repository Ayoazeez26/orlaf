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
}

export function DiscoveryRailCard({
  rail,
  onAddContent,
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
              <RailStatusBadge status={rail.status} />
              {rail.type === "hero" ? <HeroBadge /> : null}
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
          >
            <ArrowUp className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Move rail down"
          >
            <ArrowDown className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={rail.isVisible ? "Hide rail" : "Show rail"}
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
          >
            <Pencil className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Delete rail"
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
          <DiscoveryContentCard key={`${rail.id}-${item.id}`} item={item} />
        ))}
        <AddContentCard onClick={() => onAddContent?.(rail)} />
      </div>
    </div>
  )
}
