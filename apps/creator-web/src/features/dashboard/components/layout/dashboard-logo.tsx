import { cn } from "@workspace/ui/lib/utils"

interface DashboardLogoProps {
  className?: string
}

export function DashboardLogo({ className }: DashboardLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 px-2", className)}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-sm">
        S
      </span>
      <span className="font-semibold text-base text-foreground tracking-tight">
        Sable Studio
      </span>
    </div>
  )
}
