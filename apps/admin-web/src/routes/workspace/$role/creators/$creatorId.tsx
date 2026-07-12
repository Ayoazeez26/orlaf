import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { CreatorDetailPage } from "@/features/creators/components/detail/creator-detail-page"
import { getCreatorDetail } from "@/features/creators/data/creator-details"
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
  const creator = getCreatorDetail(creatorId)

  if (!creator) {
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
          We couldn&apos;t find that creator.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CreatorDetailPage creator={creator} role={role} />
    </div>
  )
}
