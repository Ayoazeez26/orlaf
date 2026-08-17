import { cn } from "@workspace/ui/lib/utils"
import { BookOpen, MessageCircle, Shield, Ticket } from "lucide-react"
import type { SupportTab } from "../types"

const TABS: { id: SupportTab; label: string; icon: typeof BookOpen }[] = [
  { id: "articles", label: "Articles", icon: BookOpen },
  { id: "ticket", label: "Ticket", icon: Ticket },
  { id: "chat", label: "Live chat", icon: MessageCircle },
  { id: "guidelines", label: "Guidelines", icon: Shield },
]

interface SupportTabsProps {
  active: SupportTab
  onChange: (tab: SupportTab) => void
}

export function SupportTabs({ active, onChange }: SupportTabsProps) {
  return (
    <div className="flex flex-wrap gap-1 border-border border-b">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 font-medium text-sm transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
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
