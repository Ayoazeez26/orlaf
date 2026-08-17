import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import type { WorkspaceRoleId } from "../../types"

interface PanelHeaderProps {
  title: string
  actionLabel?: string
  actionTo?: "/workspace/$role/audit-log/"
  role?: WorkspaceRoleId
}

export function PanelHeader({
  title,
  actionLabel,
  actionTo,
  role,
}: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-semibold text-foreground text-lg tracking-tight">
        {title}
      </h2>
      {actionLabel && actionTo && role ? (
        <Link
          to={actionTo}
          params={{ role }}
          className="flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          {actionLabel}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      ) : actionLabel ? (
        <span className="flex items-center gap-1 font-medium text-muted-foreground text-sm">
          {actionLabel}
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      ) : null}
    </div>
  )
}
