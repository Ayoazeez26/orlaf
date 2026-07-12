import { ArrowUpRight } from "lucide-react"

interface PanelHeaderProps {
  title: string
  actionLabel?: string
}

export function PanelHeader({ title, actionLabel }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-semibold text-foreground text-lg tracking-tight">
        {title}
      </h2>
      {actionLabel ? (
        <button
          type="button"
          className="flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          {actionLabel}
          <ArrowUpRight className="size-4" aria-hidden />
        </button>
      ) : null}
    </div>
  )
}
