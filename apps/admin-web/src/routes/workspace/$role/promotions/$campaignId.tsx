import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { PromotionDetailPage } from "@/features/promotions/components/detail/promotion-detail-page"
import { useAdminPromotionDetail } from "@/features/promotions/hooks/use-promotions"
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
  const {
    data: campaign,
    isLoading,
    isError,
  } = useAdminPromotionDetail(campaignId)

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(["a", "b", "c", "d"] as const).map((key) => (
            <div
              key={key}
              className="h-24 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !campaign) {
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
