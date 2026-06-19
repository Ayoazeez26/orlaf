import { Link } from "@tanstack/react-router"
import { Progress } from "@workspace/ui/components/progress"
import { ChevronRight, Megaphone } from "lucide-react"
import { promotionDetailPath } from "../../constants"
import {
  formatCurrency,
  formatPromotionMeta,
} from "../../lib/filter-promotions"
import type { PromotionSummary } from "../../types"
import { PromotionStatusBadge } from "../shared/promotion-status-badge"

interface PromotionListRowProps {
  promotion: PromotionSummary
}

export function PromotionListRow({ promotion }: PromotionListRowProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
      <Link
        {...promotionDetailPath(promotion.id)}
        className="flex min-w-0 flex-1 items-center gap-4 transition-opacity hover:opacity-80"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-payout-accent-muted">
          <Megaphone
            className="size-4 text-primary"
            strokeWidth={2}
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-foreground text-sm">
              {promotion.title}
            </p>
            <PromotionStatusBadge status={promotion.status} />
          </div>
          <p className="truncate text-muted-foreground text-xs">
            {formatPromotionMeta(promotion)}
          </p>
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:hidden">
        <div className="flex w-full items-center justify-between">
          <span className="text-foreground text-sm">
            {formatCurrency(promotion.spent)}
          </span>
          <span className="text-muted-foreground text-sm">
            {promotion.progressPercent}%
          </span>
        </div>
        <Progress
          value={promotion.progressPercent}
          className="h-2 bg-muted [&_[data-slot=progress-indicator]]:bg-primary"
        />
      </div>

      <div className="hidden min-w-[220px] items-center gap-4 sm:flex">
        <div className="min-w-[160px] flex-1 space-y-1.5">
          <div className="flex w-full items-center justify-between">
            <span className="text-[#5F636F] text-sm">
              {formatCurrency(promotion.spent)}
            </span>
            <span className="text-[#5F636F] text-sm">
              {promotion.progressPercent}%
            </span>
          </div>
          <Progress
            value={promotion.progressPercent}
            className="h-2 bg-muted [&_[data-slot=progress-indicator]]:bg-primary"
          />
        </div>
        <span className="w-24 shrink-0 text-right text-muted-foreground text-xs">
          {promotion.impressions} impressions
        </span>
      </div>

      <Link
        {...promotionDetailPath(promotion.id)}
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        aria-label={`View ${promotion.title}`}
      >
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </div>
  )
}
