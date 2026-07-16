import { cn } from "@workspace/ui/lib/utils"
import { SableLogoIcon } from "@/components/sable-logo-icon"

interface SableBrandMarkProps {
  className?: string
  subtitle?: string
  size?: "sm" | "md" | "lg"
}

export function SableBrandMark({
  className,
  subtitle,
  size = "lg",
}: SableBrandMarkProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-border/50">
        <SableLogoIcon size={size} />
      </span>
      {subtitle ? (
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      ) : null}
    </div>
  )
}
