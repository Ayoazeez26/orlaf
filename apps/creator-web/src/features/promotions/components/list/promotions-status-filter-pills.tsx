import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { PROMOTION_STATUS_FILTER_PILLS } from "../../constants"
import type { PromotionStatusFilter } from "../../types"

interface PromotionsStatusFilterPillsProps {
  value: PromotionStatusFilter
  onChange: (value: PromotionStatusFilter) => void
}

export function PromotionsStatusFilterPills({
  value,
  onChange,
}: PromotionsStatusFilterPillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {PROMOTION_STATUS_FILTER_PILLS.map((pill) => {
        const isActive = value === pill.value

        return (
          <Button
            key={pill.value}
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onChange(pill.value)}
            className={cn(
              "h-8 rounded-full px-3.5 font-medium text-xs",
              isActive
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {pill.label}
          </Button>
        )
      })}
    </div>
  )
}
