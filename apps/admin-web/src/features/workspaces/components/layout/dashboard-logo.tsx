import { Link } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { SableLogoIcon } from "@/components/sable-logo-icon"

interface DashboardLogoProps {
  subtitle: string
  className?: string
}

export function DashboardLogo({ subtitle, className }: DashboardLogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-3 px-2 transition-opacity hover:opacity-90",
        className
      )}
    >
      <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-border/50">
        <SableLogoIcon size="md" />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="font-semibold text-base text-foreground tracking-tight">
          Sable TV
        </p>
        <p className="truncate text-muted-foreground text-xs">{subtitle}</p>
      </div>
    </Link>
  )
}
