import { cn } from "@workspace/ui/lib/utils"
import { ArrowUpRight } from "lucide-react"
import { TONE_CHIP_CLASS } from "../../lib/tones"
import type { PanelItem } from "../../types"

interface PanelItemRowProps {
  item: PanelItem
}

export function PanelItemRow({ item }: PanelItemRowProps) {
  const Icon = item.icon

  if (item.trailing) {
    return (
      <li className="flex items-center gap-3 py-1">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            TONE_CHIP_CLASS[item.tone]
          )}
        >
          <Icon className="size-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground text-sm">
            {item.title}
          </p>
          <p className="truncate text-muted-foreground text-xs">
            {item.subtitle}
          </p>
        </div>
        <span className="shrink-0 text-muted-foreground text-xs">
          {item.trailing}
        </span>
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background/40 p-3 text-left transition-colors hover:bg-muted/50"
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            TONE_CHIP_CLASS[item.tone]
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground text-sm">{item.title}</p>
          <p className="text-muted-foreground text-xs">{item.subtitle}</p>
        </div>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </button>
    </li>
  )
}
