import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useStreamerQuery } from "@/features/streamers/api/streamers-hooks"
import { StreamerDetailPage } from "@/features/streamers/components/detail/streamer-detail-page"
import { mapStreamerDetail } from "@/features/streamers/lib/map-streamer"
import { DetailPageSkeleton } from "@/features/workspaces/components/page-skeletons"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/streamers/$streamerId")({
  component: WorkspaceStreamerDetail,
})

function WorkspaceStreamerDetail() {
  const { role, streamerId } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="streamers">
      <StreamerDetailContent role={workspaceRole} streamerId={streamerId} />
    </WorkspaceSectionGate>
  )
}

function StreamerDetailContent({
  role,
  streamerId,
}: {
  role: WorkspaceRoleId
  streamerId: string
}) {
  const { data, isPending, isError, error } = useStreamerQuery(streamerId)

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
          to="/workspace/$role/streamers"
          params={{ role }}
          className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Users
        </Link>
        <p className="text-muted-foreground text-sm">
          {error instanceof Error
            ? error.message
            : "We couldn't find that streamer."}
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <StreamerDetailPage streamer={mapStreamerDetail(data)} role={role} />
    </div>
  )
}
