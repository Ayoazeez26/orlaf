import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WatchHistoryItem } from "../../../types"

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

interface StreamerWatchHistoryTabProps {
  items: WatchHistoryItem[]
}

function ProgressCell({ value }: { value: number }) {
  return (
    <div className="flex min-w-[140px] items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-muted-foreground text-xs tabular-nums">
        {value}%
      </span>
    </div>
  )
}

export function StreamerWatchHistoryTab({
  items,
}: StreamerWatchHistoryTabProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-0")}>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className={HEAD_CLASS}>Series</th>
              <th className={HEAD_CLASS}>Episode</th>
              <th className={HEAD_CLASS}>Title</th>
              <th className={HEAD_CLASS}>Progress</th>
              <th className={HEAD_CLASS}>Watched</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={`${item.series}-${item.episode}-${item.title}`}
                className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="whitespace-nowrap px-4 py-3.5 font-medium text-foreground">
                  {item.series}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                  {item.episode}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-medium text-foreground">
                  {item.title}
                </td>
                <td className="px-4 py-3.5">
                  <ProgressCell value={item.progress} />
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                  {item.watched}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
