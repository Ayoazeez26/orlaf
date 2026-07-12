import { cn } from "@workspace/ui/lib/utils"
import { PAYOUT_VIEWS } from "../constants"
import type { PayoutView } from "../types"

interface PayoutsViewTabsProps {
  active: PayoutView
  onChange: (view: PayoutView) => void
}

export function PayoutsViewTabs({ active, onChange }: PayoutsViewTabsProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-muted/40 p-1">
      {PAYOUT_VIEWS.map((view) => {
        const isActive = view.key === active

        return (
          <button
            key={view.key}
            type="button"
            onClick={() => onChange(view.key)}
            className={cn(
              "rounded-full px-4 py-1.5 font-medium text-sm transition-colors",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {view.label}
          </button>
        )
      })}
    </div>
  )
}
