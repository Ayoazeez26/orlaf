import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { PromotionCampaignDetail } from "../../types"
import { PromotionStatusBadge } from "../promotion-badges"

interface PromotionDetailHeaderProps {
  campaign: PromotionCampaignDetail
  role: WorkspaceRoleId
}

export function PromotionDetailHeader({
  campaign,
  role,
}: PromotionDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <Link
        to="/workspace/$role/promotions"
        params={{ role }}
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Promotions
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
            {campaign.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {campaign.creatorName} · {campaign.projectName} ·{" "}
            {campaign.placement}
          </p>
        </div>
        <PromotionStatusBadge status={campaign.status} />
      </div>
    </div>
  )
}
