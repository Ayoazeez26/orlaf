import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { ApplicationDetail } from "../../types"
import { ApplicationDetailHeader } from "./application-detail-header"
import { ApplicationInfoCard } from "./application-info-card"
import { OnboardingChecklistCard } from "./onboarding-checklist-card"

interface ApplicationDetailPageProps {
  application: ApplicationDetail
  role: WorkspaceRoleId
}

export function ApplicationDetailPage({
  application,
  role,
}: ApplicationDetailPageProps) {
  return (
    <div className="space-y-6">
      <ApplicationDetailHeader application={application} role={role} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ApplicationInfoCard application={application} />
        <OnboardingChecklistCard steps={application.checklist} />
      </div>
    </div>
  )
}
