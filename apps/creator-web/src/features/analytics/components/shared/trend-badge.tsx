import { cn } from "@workspace/ui/lib/utils"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

interface TrendBadgeProps {
  changePercent: number | null | undefined
  variant?: "default" | "compact" | "inline"
  className?: string
}

export function TrendBadge({
  changePercent,
  variant = "default",
  className,
}: TrendBadgeProps) {
  if (changePercent == null || Number.isNaN(changePercent)) {
    return null
  }

  const isPositive = changePercent >= 0
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight
  const absValue = Math.abs(changePercent).toFixed(1)
  const trendColor = isPositive ? "text-trend-positive" : "text-trend-negative"

  if (variant === "inline") {
    return (
      <p className={cn("flex flex-wrap items-center gap-1 text-sm", className)}>
        <Icon className={cn("size-4 shrink-0", trendColor)} aria-hidden />
        <span className={cn("font-medium", trendColor)}>{absValue}%</span>
        <span className="text-muted-foreground">vs last period</span>
      </p>
    )
  }

  const label =
    variant === "compact" ? `${absValue}%` : `${absValue}% vs last period`

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-1 font-medium text-xs",
        isPositive
          ? "bg-trend-positive-muted text-trend-positive"
          : "bg-trend-negative-muted text-trend-negative",
        className
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {label}
    </span>
  )
}
