import { cn } from "@workspace/ui/lib/utils"
import { Clapperboard, Film, type LucideIcon } from "lucide-react"
import type { ProjectIconVariant } from "../../types"

const PROJECT_ICON_STYLES: Record<
  ProjectIconVariant,
  { color: string; icon: LucideIcon }
> = {
  purple: {
    color: "#7C3AED",
    icon: Clapperboard,
  },
  pink: {
    color: "#EC4899",
    icon: Film,
  },
  blue: {
    color: "#0EA5E9",
    icon: Clapperboard,
  },
}

interface ProjectListThumbnailProps {
  variant: ProjectIconVariant
  className?: string
  iconClassName?: string
}

export function ProjectListThumbnail({
  variant,
  className,
  iconClassName,
}: ProjectListThumbnailProps) {
  const { color, icon: Icon } = PROJECT_ICON_STYLES[variant]

  return (
    <div
      className={cn(
        "flex h-[70px] w-12 shrink-0 items-center justify-center rounded-xl text-white",
        className
      )}
      style={{ backgroundColor: color }}
    >
      <Icon
        className={cn("size-5", iconClassName)}
        strokeWidth={1.75}
        aria-hidden
      />
    </div>
  )
}
