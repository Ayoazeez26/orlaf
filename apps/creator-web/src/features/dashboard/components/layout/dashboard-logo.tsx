import { cn } from "@workspace/ui/lib/utils"
import { SableLogoIcon } from "@/components/sable-logo-icon"

interface DashboardLogoProps {
  className?: string
}

export function DashboardLogo({ className }: DashboardLogoProps) {
  return (
    <div className={cn("flex items-center gap-3 px-2", className)}>
      <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-border/50">
        <SableLogoIcon size="md" />
      </span>
      <span className="font-semibold text-base text-foreground tracking-tight">
        Sable Studio
      </span>
    </div>
  )
}
