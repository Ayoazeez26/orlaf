import { cn } from "@workspace/ui/lib/utils"

interface GrowthBadgeProps {
  value: string
  className?: string
}

export function GrowthBadge({ value, className }: GrowthBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full bg-[#10B98126] px-2 py-1 font-medium text-[#34D399] text-xs",
        className
      )}
    >
      {value}
    </span>
  )
}
