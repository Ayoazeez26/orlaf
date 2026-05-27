import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import type { ProjectStatus } from "../../types"

const STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: "border-transparent bg-primary/90 text-white",
  },
  draft: {
    label: "Draft",
    className: "border-transparent bg-primary/15 text-primary",
  },
  ongoing: {
    label: "Ongoing",
    className:
      "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  completed: {
    label: "Completed",
    className: "border-transparent bg-primary/15 text-primary",
  },
}

const LIST_STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: "border-transparent bg-primary/15 text-primary",
  },
  draft: {
    label: "Draft",
    className:
      "border-transparent bg-muted text-muted-foreground uppercase tracking-wide",
  },
  ongoing: {
    label: "Ongoing",
    className:
      "border-transparent bg-[#10B98126] text-[#34D399] uppercase tracking-wide",
  },
  completed: {
    label: "Completed",
    className:
      "border-transparent bg-primary/15 text-primary uppercase tracking-wide",
  },
}

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  variant?: "default" | "list"
  className?: string
}

export function ProjectStatusBadge({
  status,
  variant = "default",
  className,
}: ProjectStatusBadgeProps) {
  const config =
    variant === "list" ? LIST_STATUS_STYLES[status] : STATUS_STYLES[status]

  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 font-semibold text-[11px] leading-none",
        variant === "default" && "pt-1 capitalize",
        variant === "list" && "px-3 py-1.5",
        config.className,
        className
      )}
    >
      {variant === "list" ? config.label.toUpperCase() : config.label}
    </Badge>
  )
}
