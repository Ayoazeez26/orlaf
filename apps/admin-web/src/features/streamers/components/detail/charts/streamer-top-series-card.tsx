import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Tv } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { TopSeriesWatched } from "../../../types"

interface StreamerTopSeriesCardProps {
  items: TopSeriesWatched[]
}

export function StreamerTopSeriesCard({ items }: StreamerTopSeriesCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-5 px-6">
        <h2 className="font-semibold text-foreground text-lg tracking-tight">
          Top series watched
        </h2>

        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={item.title} className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Tv className="size-4 text-primary" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground text-sm">
                  {index + 1}. {item.title}
                </p>
                <p className="text-muted-foreground text-xs">
                  {item.hours} h · {item.episodes} eps
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
