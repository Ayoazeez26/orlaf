import { cn } from "@workspace/ui/lib/utils"
import { TONE_FILL_CLASS } from "../../lib/tones"
import type { ProgressRow } from "../../types"

interface ProgressRowsProps {
  rows: ProgressRow[]
}

export function ProgressRows({ rows }: ProgressRowsProps) {
  return (
    <ul className="flex flex-col gap-4">
      {rows.map((row) => (
        <li key={row.label} className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-foreground text-sm">{row.label}</span>
            <span className="font-semibold text-foreground text-sm tabular-nums">
              {row.value}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                TONE_FILL_CLASS[row.tone]
              )}
              style={{ width: `${Math.min(Math.max(row.percent, 0), 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
