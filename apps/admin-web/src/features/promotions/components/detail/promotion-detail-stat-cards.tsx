import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import {
  CircleDollarSign,
  Eye,
  Megaphone,
  MousePointerClick,
} from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import { formatImpressions, formatNaira } from "../../lib/format"
import type { PromotionCampaignDetail } from "../../types"

interface PromotionDetailStatCardsProps {
  campaign: PromotionCampaignDetail
}

const STAT_DEFS: {
  label: string
  getValue: (campaign: PromotionCampaignDetail) => string
  icon: typeof Megaphone
  tone: Tone
}[] = [
  {
    label: "Budget",
    getValue: (campaign) => formatNaira(campaign.budget),
    icon: CircleDollarSign,
    tone: "primary",
  },
  {
    label: "Spent",
    getValue: (campaign) => formatNaira(campaign.spent),
    icon: Megaphone,
    tone: "primary",
  },
  {
    label: "Impressions",
    getValue: (campaign) => formatImpressions(campaign.impressions),
    icon: Eye,
    tone: "primary",
  },
  {
    label: "CTR",
    getValue: (campaign) => `${campaign.ctr.toFixed(1)}%`,
    icon: MousePointerClick,
    tone: "primary",
  },
]

export function PromotionDetailStatCards({
  campaign,
}: PromotionDetailStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_DEFS.map((stat) => {
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
                  TONE_CHIP_CLASS[stat.tone]
                )}
              >
                <Icon className="size-5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-muted-foreground text-xs uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="font-bold text-2xl text-foreground tracking-tight">
                  {stat.getValue(campaign)}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
