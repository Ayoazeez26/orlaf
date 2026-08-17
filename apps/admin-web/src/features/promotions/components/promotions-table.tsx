import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { MoreHorizontal, Pause, Play } from "lucide-react"
import { TONE_FILL_CLASS } from "@/features/workspaces/lib/tones"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { formatImpressions, formatNaira } from "../lib/format"
import type { PromotionCampaign } from "../types"
import { PromotionStatusBadge } from "./promotion-badges"

interface PromotionsTableProps {
  campaigns: PromotionCampaign[]
  role: WorkspaceRoleId
  onApprove: (campaign: PromotionCampaign) => void
  onReject: (campaign: PromotionCampaign) => void
  onPause: (campaign: PromotionCampaign) => void
  onResume: (campaign: PromotionCampaign) => void
}

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

export function PromotionsTable({
  campaigns,
  role,
  onApprove,
  onReject,
  onPause,
  onResume,
}: PromotionsTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No campaigns match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={HEAD_CLASS}>Campaign</th>
            <th className={HEAD_CLASS}>Placement</th>
            <th className={HEAD_CLASS}>Budget</th>
            <th className={HEAD_CLASS}>Performance</th>
            <th className={HEAD_CLASS}>Status</th>
            <th className={HEAD_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => {
            const budgetPercent =
              campaign.budget > 0
                ? Math.min((campaign.spent / campaign.budget) * 100, 100)
                : 0

            return (
              <tr
                key={campaign.id}
                className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <div className="min-w-0">
                    <Link
                      to="/workspace/$role/promotions/$campaignId"
                      params={{ role, campaignId: campaign.id }}
                      className="font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {campaign.title}
                    </Link>
                    <p className="mt-0.5 text-muted-foreground text-xs">
                      {campaign.creatorName} · {campaign.schedule}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {campaign.placementLabel}
                </td>
                <td className="min-w-[180px] px-4 py-3">
                  <div className="space-y-1.5">
                    <p className="font-medium text-foreground text-xs tabular-nums">
                      {formatNaira(campaign.spent)} /{" "}
                      {formatNaira(campaign.budget)}
                    </p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          TONE_FILL_CLASS.primary
                        )}
                        style={{ width: `${budgetPercent}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <p>{formatImpressions(campaign.impressions)} impressions</p>
                  <p className="text-xs">{campaign.ctr.toFixed(1)}% CTR</p>
                </td>
                <td className="px-4 py-3">
                  <PromotionStatusBadge status={campaign.status} />
                </td>
                <td className="px-4 py-3">
                  <CampaignActions
                    campaign={campaign}
                    onApprove={onApprove}
                    onReject={onReject}
                    onPause={onPause}
                    onResume={onResume}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CampaignActions({
  campaign,
  onApprove,
  onReject,
  onPause,
  onResume,
}: {
  campaign: PromotionCampaign
  onApprove: (campaign: PromotionCampaign) => void
  onReject: (campaign: PromotionCampaign) => void
  onPause: (campaign: PromotionCampaign) => void
  onResume: (campaign: PromotionCampaign) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {campaign.status === "live" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => onPause(campaign)}
        >
          <Pause className="size-3.5" aria-hidden />
          Pause
        </Button>
      ) : null}
      {campaign.status === "pending" ? (
        <>
          <Button type="button" size="sm" onClick={() => onApprove(campaign)}>
            Approve
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-600"
            onClick={() => onReject(campaign)}
          >
            Reject
          </Button>
        </>
      ) : null}
      {campaign.status === "paused" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => onResume(campaign)}
        >
          <Play className="size-3.5" aria-hidden />
          Resume
        </Button>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label="More actions"
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </Button>
    </div>
  )
}
