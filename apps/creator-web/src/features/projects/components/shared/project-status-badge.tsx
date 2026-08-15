import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import type { ProjectStatus } from "../../types"

const PUBLISHED_PILL_CLASS =
  "border-[#2BBB7133] bg-[#2BBB7126] text-[#002C0F] dark:text-emerald-300"

const REJECTED_PILL_CLASS =
  "border-transparent bg-red-500/15 text-red-700 dark:text-red-400"

const STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: PUBLISHED_PILL_CLASS,
  },
  draft: {
    label: "Draft",
    className: "border-transparent bg-primary/15 text-primary",
  },
  in_review: {
    label: "In review",
    className: "border-transparent bg-amber-500/15 text-amber-700",
  },
  rejected: {
    label: "Rejected",
    className: REJECTED_PILL_CLASS,
  },
  scheduled: {
    label: "Scheduled",
    className: "border-transparent bg-sky-500/15 text-sky-700",
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

const TABLE_STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: PUBLISHED_PILL_CLASS,
  },
  in_review: {
    label: "In review",
    className: "border-transparent bg-[#FFF0C5] text-[#5C2C00]",
  },
  rejected: {
    label: "Rejected",
    className: "border-transparent bg-[#FEE2E2] text-[#991B1B]",
  },
  draft: {
    label: "Draft",
    className: "border-transparent bg-[#F0F2F7] text-[#5F636F]",
  },
  scheduled: {
    label: "Scheduled",
    className: "border-transparent bg-sky-500/15 text-sky-700",
  },
  ongoing: {
    label: "Ongoing",
    className: "border-transparent bg-emerald-500/15 text-emerald-600",
  },
  completed: {
    label: "Completed",
    className: "border-transparent bg-primary/15 text-primary",
  },
}

const OVERLAY_STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: `${PUBLISHED_PILL_CLASS} backdrop-blur-sm`,
  },
  draft: {
    label: "Draft",
    className:
      "border-transparent bg-white/60 text-foreground backdrop-blur-sm",
  },
  in_review: {
    label: "In review",
    className:
      "border-[#FCB4424D] bg-[#FCB44233] text-[#5C2C00] backdrop-blur-sm",
  },
  rejected: {
    label: "Rejected",
    className: "border-transparent bg-red-500/20 text-red-950 backdrop-blur-sm",
  },
  scheduled: {
    label: "Scheduled",
    className: "border-transparent bg-sky-200/70 text-sky-950 backdrop-blur-sm",
  },
  ongoing: {
    label: "Ongoing",
    className:
      "border-transparent bg-emerald-200/70 text-emerald-950 backdrop-blur-sm",
  },
  completed: {
    label: "Completed",
    className: "border-transparent bg-primary/30 text-primary backdrop-blur-sm",
  },
}

const LIST_STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: `${PUBLISHED_PILL_CLASS} uppercase tracking-wide`,
  },
  draft: {
    label: "Draft",
    className:
      "border-transparent bg-muted text-muted-foreground uppercase tracking-wide",
  },
  in_review: {
    label: "In review",
    className:
      "border-transparent bg-amber-500/15 text-amber-700 uppercase tracking-wide",
  },
  rejected: {
    label: "Rejected",
    className:
      "border-transparent bg-red-500/15 text-red-700 uppercase tracking-wide",
  },
  scheduled: {
    label: "Scheduled",
    className:
      "border-transparent bg-sky-500/15 text-sky-700 uppercase tracking-wide",
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
  variant?: "default" | "list" | "table" | "overlay"
  className?: string
}

export function ProjectStatusBadge({
  status,
  variant = "default",
  className,
}: ProjectStatusBadgeProps) {
  const config =
    variant === "table"
      ? TABLE_STATUS_STYLES[status]
      : variant === "list"
        ? LIST_STATUS_STYLES[status]
        : variant === "overlay"
          ? OVERLAY_STATUS_STYLES[status]
          : STATUS_STYLES[status]

  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 font-medium text-xs",
        variant === "default" &&
          "pt-1 font-semibold text-[11px] capitalize leading-none",
        variant === "list" &&
          "px-3 py-1.5 font-semibold text-[11px] uppercase leading-none tracking-wide",
        variant === "table" && "px-2.5 py-1.5",
        variant === "overlay" &&
          "px-3 py-1.5 font-semibold text-xs leading-none",
        config.className,
        className
      )}
    >
      {variant === "list" ? config.label.toUpperCase() : config.label}
    </Badge>
  )
}
