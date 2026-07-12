import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Pencil } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_FILL_CLASS } from "@/features/workspaces/lib/tones"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { formatNaira } from "../../lib/format"
import type { PromotionCampaignDetail } from "../../types"

interface PromotionOverviewCardProps {
  campaign: PromotionCampaignDetail
  role: WorkspaceRoleId
  onAddNote: () => void
}

export function PromotionOverviewCard({
  campaign,
  role,
  onAddNote,
}: PromotionOverviewCardProps) {
  const budgetPercent =
    campaign.budget > 0
      ? Math.min((campaign.spent / campaign.budget) * 100, 100)
      : 0

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardHeader className="px-5 pb-4 sm:px-6">
        <CardTitle className="font-semibold text-base">
          Campaign overview
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Live performance and delivery details for this campaign.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 px-5 sm:px-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">
              Budget utilization
            </span>
            <span className="text-muted-foreground tabular-nums">
              {Math.round(budgetPercent)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                TONE_FILL_CLASS.primary
              )}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <p className="text-muted-foreground text-sm">
            {formatNaira(campaign.spent)} spent of{" "}
            {formatNaira(campaign.budget)}
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="Creator" value={campaign.creatorName} />
          <DetailItem label="Project" value={campaign.projectName} />
          <DetailItem label="Placement" value={campaign.placement} />
          <DetailItem label="Schedule" value={campaign.schedule} />
        </dl>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Reviewer note
          </p>
          <p className="mt-2 text-foreground text-sm">
            {campaign.reviewerNote ??
              "No internal note added yet. Use 'Add note' to leave context for your team."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={onAddNote}
          >
            <Pencil className="size-4" aria-hidden />
            Add note
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/workspace/$role/promotions" params={{ role }}>
              View all campaigns
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-foreground text-sm">{value}</dd>
    </div>
  )
}
