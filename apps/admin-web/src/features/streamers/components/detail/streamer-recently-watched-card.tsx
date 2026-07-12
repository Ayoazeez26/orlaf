import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { RecentlyWatched } from "../../types"

export function StreamerRecentlyWatchedCard({
  items,
}: {
  items: RecentlyWatched[]
}) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-5 px-6">
        <h2 className="font-semibold text-foreground text-lg tracking-tight">
          Recently watched
        </h2>

        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={`${item.title}-${item.meta}`}
              className="flex items-center gap-3"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground text-sm">
                  {item.title}
                </p>
                <p className="truncate text-muted-foreground text-xs">
                  {item.meta}
                </p>
              </div>
              <span className="shrink-0 font-medium text-muted-foreground text-xs tabular-nums">
                {item.percent}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
