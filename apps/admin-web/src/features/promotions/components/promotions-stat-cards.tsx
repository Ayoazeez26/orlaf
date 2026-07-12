import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { CircleDollarSign, Eye, Megaphone, Sparkles } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import { formatImpressions } from "../lib/format"
import type { PromotionCampaign, PromotionSummaryStat } from "../types"

interface PromotionsStatCardsProps {
  campaigns: PromotionCampaign[]
}

const STAT_DEFS: {
  getValue: (campaigns: PromotionCampaign[]) => string
  stat: Omit<PromotionSummaryStat, "value">
  tone: Tone
}[] = [
  {
    getValue: (campaigns) =>
      String(campaigns.filter((c) => c.status === "live").length),
    stat: { label: "Live campaigns", icon: Megaphone },
    tone: "primary",
  },
  {
    getValue: (campaigns) =>
      String(campaigns.filter((c) => c.status === "pending").length),
    stat: { label: "Pending review", icon: Sparkles },
    tone: "warning",
  },
  {
    getValue: (campaigns) =>
      formatImpressions(
        campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
      ),
    stat: { label: "Impressions (30d)", icon: Eye },
    tone: "info",
  },
  {
    getValue: (campaigns) => {
      const total = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0)
      return `₦${total.toLocaleString("en-NG")}`
    },
    stat: { label: "Ad spend (30d)", icon: CircleDollarSign },
    tone: "positive",
  },
]

export function PromotionsStatCards({ campaigns }: PromotionsStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_DEFS.map(({ getValue, stat, tone }) => {
        const Icon = stat.icon

        return (
          <Card
            key={stat.label}
            className={cn(FROSTED_CARD_SURFACE_CLASS, "py-5")}
          >
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
                  {stat.label}
                </p>
                <p className="font-bold text-2xl text-foreground tracking-tight">
                  {getValue(campaigns)}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
