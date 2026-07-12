import { createFileRoute } from "@tanstack/react-router"
import { OnboardingPage } from "@/features/onboarding/components/onboarding-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/onboarding/")({
  component: WorkspaceOnboarding,
})

function WorkspaceOnboarding() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="onboarding">
      <OnboardingPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
