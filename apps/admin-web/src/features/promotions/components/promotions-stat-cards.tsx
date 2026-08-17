import type { AdminPromotionsListSummary } from "@sable/contracts"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { CircleDollarSign, Eye, Megaphone, Sparkles } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import { formatImpressions } from "../lib/format"

interface PromotionsStatCardsProps {
  summary: AdminPromotionsListSummary
}

const STAT_DEFS: {
  label: string
  icon: typeof Megaphone
  tone: Tone
  getValue: (summary: AdminPromotionsListSummary) => string
}[] = [
  {
    label: "Live campaigns",
    icon: Megaphone,
    tone: "primary",
    getValue: (summary) => String(summary.liveCount),
  },
  {
    label: "Pending review",
    icon: Sparkles,
    tone: "warning",
    getValue: (summary) => String(summary.pendingCount),
  },
  {
    label: "Impressions (30d)",
    icon: Eye,
    tone: "info",
    getValue: (summary) => formatImpressions(summary.totalImpressions30d),
  },
  {
    label: "Ad spend (30d)",
    icon: CircleDollarSign,
    tone: "positive",
    getValue: (summary) => `$${summary.totalSpend30d.toLocaleString("en-US")}`,
  },
]

export function PromotionsStatCards({ summary }: PromotionsStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_DEFS.map(({ label, icon: Icon, tone, getValue }) => (
        <Card key={label} className={cn(FROSTED_CARD_SURFACE_CLASS, "py-5")}>
          <CardContent className="flex items-center gap-4 p-0 px-5">
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                TONE_CHIP_CLASS[tone]
              )}
            >
              <Icon className="size-5" strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-muted-foreground text-xs uppercase tracking-wide">
                {label}
              </p>
              <p className="font-bold text-2xl text-foreground tracking-tight">
                {getValue(summary)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
