import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { PromotionDetailPage } from "@/features/promotions/components/detail/promotion-detail-page"
import { getPromotionDetail } from "@/features/promotions/data/promotion-details"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/promotions/$campaignId")(
  {
    component: WorkspacePromotionDetail,
  }
)

function WorkspacePromotionDetail() {
  const { role, campaignId } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="promotions">
      <PromotionDetailContent role={workspaceRole} campaignId={campaignId} />
    </WorkspaceSectionGate>
  )
}

function PromotionDetailContent({
  role,
  campaignId,
}: {
  role: WorkspaceRoleId
  campaignId: string
}) {
  const campaign = getPromotionDetail(campaignId)

  if (!campaign) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <Link
          to="/workspace/$role/promotions"
          params={{ role }}
          className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Promotions
        </Link>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t find that campaign.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PromotionDetailPage campaign={campaign} role={role} />
    </div>
  )
}
