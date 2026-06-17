import { Link } from "@tanstack/react-router"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"
import { Megaphone } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { promotionDetailPath } from "../../constants"
import {
  formatCurrency,
  formatPromotionMeta,
} from "../../lib/filter-promotions"
import type { PromotionSummary } from "../../types"
import { PromotionStatusBadge } from "../shared/promotion-status-badge"

interface PromotionCardProps {
  promotion: PromotionSummary
}

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-0")}>
      <CardContent className="p-5">
        <Link
          {...promotionDetailPath(promotion.id)}
          className="block space-y-4 transition-opacity hover:opacity-80"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-payout-accent-muted">
              <Megaphone
                className="size-4 text-primary"
                strokeWidth={2}
                aria-hidden
              />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground text-sm">
                  {promotion.title}
                </p>
                <PromotionStatusBadge status={promotion.status} />
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                {formatPromotionMeta(promotion)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">
                {formatCurrency(promotion.spent)}
              </span>
              <span className="text-muted-foreground">
                {promotion.progressPercent}%
              </span>
            </div>
            <Progress
              value={promotion.progressPercent}
              className="h-1.5 bg-muted"
            />
            <p className="text-muted-foreground text-xs">
              {promotion.impressions} impressions
            </p>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
