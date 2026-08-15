import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useCreatorQuery } from "@/features/creators/api/creators-hooks"
import { CreatorDetailPage } from "@/features/creators/components/detail/creator-detail-page"
import { toCreatorDetail } from "@/features/creators/data/map-creator-detail"
import { DetailPageSkeleton } from "@/features/workspaces/components/page-skeletons"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/creators/$creatorId")({
  component: WorkspaceCreatorDetail,
})

function WorkspaceCreatorDetail() {
  const { role, creatorId } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="creators">
      <CreatorDetailContent role={workspaceRole} creatorId={creatorId} />
    </WorkspaceSectionGate>
  )
}

function CreatorDetailContent({
  role,
  creatorId,
}: {
  role: WorkspaceRoleId
  creatorId: string
}) {
  const { data, isPending, isError, error } = useCreatorQuery(creatorId)

  if (isPending) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <DetailPageSkeleton />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <Link
          to="/workspace/$role/creators"
          params={{ role }}
          className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Creators
        </Link>
        <p className="text-muted-foreground text-sm">
          {error instanceof Error
            ? error.message
            : "We couldn't find that creator."}
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CreatorDetailPage creator={toCreatorDetail(data)} role={role} />
    </div>
  )
}
