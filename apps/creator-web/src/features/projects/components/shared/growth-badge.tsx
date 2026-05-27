import { cn } from "@workspace/ui/lib/utils"

interface GrowthBadgeProps {
  value: string
  className?: string
}

export function GrowthBadge({ value, className }: GrowthBadgeProps) {
  const isNegative =
    value.trim().startsWith("-") || value.trim().startsWith("↓")

  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 font-medium text-xs",
        isNegative
          ? "bg-trend-negative-muted text-trend-negative"
          : "bg-trend-positive-muted text-trend-positive",
        className
      )}
    >
      {value}
    </span>
  )
}
