import { cn } from "@workspace/ui/lib/utils"
import { REVENUE_SOURCE_COLORS } from "../../constants"
import type { RevenueSourceColorKey } from "../../types"

interface RevenueSourceProgressRowProps {
  label: string
  amount: string
  percent: number
  colorKey: RevenueSourceColorKey
  className?: string
}

export function RevenueSourceProgressRow({
  label,
  amount,
  percent,
  colorKey,
  className,
}: RevenueSourceProgressRowProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {amount} <span className="text-muted-foreground">({percent}%)</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percent}%`,
            background: REVENUE_SOURCE_COLORS[colorKey],
          }}
        />
      </div>
    </div>
  )
}
