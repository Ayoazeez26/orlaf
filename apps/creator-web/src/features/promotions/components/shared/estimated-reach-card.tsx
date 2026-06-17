import { cn } from "@workspace/ui/lib/utils"
import { Sparkles } from "lucide-react"
import type { EstimatedReach } from "../../types"

interface EstimatedReachCardProps {
  reach: EstimatedReach
  className?: string
}

export function EstimatedReachCard({
  reach,
  className,
}: EstimatedReachCardProps) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-xl border border-payout-schedule-info-border bg-payout-schedule-info-bg p-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" aria-hidden />
        <span className="font-medium text-primary text-xs uppercase tracking-wide">
          Estimated reach
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="font-bold font-space-grotesk text-foreground text-lg">
            {reach.impressions}
          </p>
          <p className="text-muted-foreground text-xs">Impressions</p>
        </div>
        <div>
          <p className="font-bold font-space-grotesk text-foreground text-lg">
            {reach.uniqueReach}
          </p>
          <p className="text-muted-foreground text-xs">Unique reach</p>
        </div>
        <div>
          <p className="font-bold font-space-grotesk text-foreground text-lg">
            {reach.clicks}
          </p>
          <p className="text-muted-foreground text-xs">Clicks</p>
        </div>
      </div>
      <p className="text-muted-foreground text-xs">{reach.footnote}</p>
    </div>
  )
}
