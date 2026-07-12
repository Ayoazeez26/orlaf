import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { PromotionCampaignDetail } from "../../types"

interface PromotionActivityCardProps {
  campaign: PromotionCampaignDetail
}

export function PromotionActivityCard({
  campaign,
}: PromotionActivityCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardHeader className="px-5 pb-4 sm:px-6">
        <CardTitle className="font-semibold text-base">Activity</CardTitle>
      </CardHeader>

      <CardContent className="px-5 sm:px-6">
        <ul className="space-y-4">
          {campaign.activity.map((entry) => {
            const Icon = entry.icon

            return (
              <li key={entry.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-4 text-muted-foreground" aria-hidden />
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="font-medium text-foreground text-sm">
                    {entry.label}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {entry.timestamp}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
