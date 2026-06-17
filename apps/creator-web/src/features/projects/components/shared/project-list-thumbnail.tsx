import { cn } from "@workspace/ui/lib/utils"
import { Clapperboard, Film, type LucideIcon } from "lucide-react"
import type { ProjectIconVariant } from "../../types"

const PROJECT_ICON_STYLES: Record<
  ProjectIconVariant,
  { gradient: string; icon: LucideIcon }
> = {
  purple: {
    gradient: "linear-gradient(180deg, #7C3AED 0%, #2C105C 100%)",
    icon: Clapperboard,
  },
  pink: {
    gradient: "linear-gradient(180deg, #EC4899 0%, #5B1638 100%)",
    icon: Film,
  },
  blue: {
    gradient: "linear-gradient(180deg, #0EA5E9 0%, #023D5A 100%)",
    icon: Clapperboard,
  },
}

interface ProjectListThumbnailProps {
  variant: ProjectIconVariant
  className?: string
}

export function ProjectListThumbnail({
  variant,
  className,
}: ProjectListThumbnailProps) {
  const { gradient, icon: Icon } = PROJECT_ICON_STYLES[variant]

  return (
    <div
      className={cn(
        "flex h-[70px] w-12 shrink-0 items-center justify-center rounded-xl text-white",
        className
      )}
      style={{ background: gradient }}
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
    </div>
  )
}
