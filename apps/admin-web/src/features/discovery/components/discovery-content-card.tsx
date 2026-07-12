import { cn } from "@workspace/ui/lib/utils"
import type { RailContentItem } from "../types"

interface DiscoveryContentCardProps {
  item: RailContentItem
}

export function DiscoveryContentCard({ item }: DiscoveryContentCardProps) {
  return (
    <div className="w-28 shrink-0">
      <div
        className={cn(
          "flex aspect-[3/4] flex-col justify-end rounded-xl bg-gradient-to-b from-primary/20 to-primary/5 p-3"
        )}
      >
        <p className="line-clamp-2 font-medium text-foreground text-xs leading-tight">
          {item.title}
        </p>
        <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
          {item.genre}
        </p>
      </div>
    </div>
  )
}

interface AddContentCardProps {
  onClick?: () => void
}

export function AddContentCard({ onClick }: AddContentCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-28 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-border border-dashed bg-muted/20 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      style={{ aspectRatio: "3/4" }}
    >
      <span className="font-medium text-xs">+ Add content</span>
    </button>
  )
}
