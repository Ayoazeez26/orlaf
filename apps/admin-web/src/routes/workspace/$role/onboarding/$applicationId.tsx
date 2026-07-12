import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { ApplicationDetailPage } from "@/features/onboarding/components/detail/application-detail-page"
import { getApplicationDetail } from "@/features/onboarding/data/application-details"
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
  const application = getApplicationDetail(applicationId)

  if (!application) {
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
          We couldn&apos;t find that application.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ApplicationDetailPage application={application} role={role} />
    </div>
  )
}
