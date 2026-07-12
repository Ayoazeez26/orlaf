import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import { BarChart3, Coins, History, Info } from "lucide-react"

export type StreamerDetailTab =
  | "overview"
  | "watch-history"
  | "billing"
  | "analytics"

interface TabDef {
  id: StreamerDetailTab
  label: string
  icon: LucideIcon
}

const TABS: TabDef[] = [
  { id: "overview", label: "Overview", icon: Info },
  { id: "watch-history", label: "Watch history", icon: History },
  { id: "billing", label: "Coins & billing", icon: Coins },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
]

interface StreamerDetailTabsProps {
  active: StreamerDetailTab
  onChange: (tab: StreamerDetailTab) => void
}

export function StreamerDetailTabs({
  active,
  onChange,
}: StreamerDetailTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.id === active

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
