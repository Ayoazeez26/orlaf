import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { SETTINGS_TABS, type SettingsTabId } from "../constants"

interface SettingsNavProps {
  active: SettingsTabId
  onChange: (tab: SettingsTabId) => void
}

export function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-3")}>
      <CardContent className="p-0 px-2">
        <nav className="flex flex-col gap-0.5">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.id === active

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left font-medium text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </CardContent>
    </Card>
  )
}
