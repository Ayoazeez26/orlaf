import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Pause, Trash2 } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { PromotionCampaign } from "../../types"

interface PromotionActionsCardProps {
  campaign: PromotionCampaign
  onPause: () => void
  onReject: () => void
  onApprove: () => void
}

export function PromotionActionsCard({
  campaign,
  onPause,
  onReject,
  onApprove,
}: PromotionActionsCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardHeader className="px-5 pb-4 sm:px-6">
        <CardTitle className="font-semibold text-base">Actions</CardTitle>
        <p className="text-muted-foreground text-sm">
          Take moderation action on this campaign.
        </p>
      </CardHeader>

      <CardContent className="space-y-3 px-5 sm:px-6">
        {campaign.status === "pending" ? (
          <>
            <Button type="button" className="w-full gap-2" onClick={onApprove}>
              <Check className="size-4" aria-hidden />
              Approve campaign
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 text-red-600 hover:text-red-600"
              onClick={onReject}
            >
              <Trash2 className="size-4" aria-hidden />
              Reject campaign
            </Button>
          </>
        ) : null}
        {campaign.status === "live" || campaign.status === "paused" ? (
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={onPause}
          >
            <Pause className="size-4" aria-hidden />
            Pause campaign
          </Button>
        ) : null}
        <Button
          type="button"
          variant="destructive"
          className="w-full gap-2"
          onClick={onReject}
        >
          <Trash2 className="size-4" aria-hidden />
          End campaign
        </Button>
      </CardContent>
    </Card>
  )
}
