import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useApplicationQuery } from "@/features/onboarding/api/onboarding-hooks"
import { ApplicationDetailPage } from "@/features/onboarding/components/detail/application-detail-page"
import { toApplicationDetail } from "@/features/onboarding/data/map-onboarding"
import { DetailPageSkeleton } from "@/features/workspaces/components/page-skeletons"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute(
  "/workspace/$role/onboarding/$applicationId"
)({
  component: WorkspaceApplicationDetail,
})

function WorkspaceApplicationDetail() {
  const { role, applicationId } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="onboarding">
      <ApplicationDetailContent
        role={workspaceRole}
        applicationId={applicationId}
      />
    </WorkspaceSectionGate>
  )
}

function ApplicationDetailContent({
  role,
  applicationId,
}: {
  role: WorkspaceRoleId
  applicationId: string
}) {
  const { data, isPending, isError, error } = useApplicationQuery(applicationId)

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
          to="/workspace/$role/onboarding"
          params={{ role }}
          className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Onboarding
        </Link>
        <p className="text-muted-foreground text-sm">
          {error instanceof Error
            ? error.message
            : "We couldn't find that application."}
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ApplicationDetailPage
        application={toApplicationDetail(data)}
        role={role}
      />
    </div>
  )
}
