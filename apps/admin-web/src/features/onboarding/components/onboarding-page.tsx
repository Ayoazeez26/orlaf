import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { ApplicationFilter, InviteFilter } from "../constants"
import { MOCK_APPLICATIONS, MOCK_INVITES } from "../data/mock-onboarding"
import { ApplicationsTable } from "./applications-table"
import { ApplicationsToolbar } from "./applications-toolbar"
import { OnboardCreatorDialog } from "./detail/onboard-creator-dialog"
import { InvitesTable } from "./invites-table"
import { InvitesToolbar } from "./invites-toolbar"
import { OnboardingPageHeader } from "./onboarding-page-header"
import { OnboardingStatCards } from "./onboarding-stat-cards"
import {
  type OnboardingView,
  OnboardingViewToggle,
} from "./onboarding-view-toggle"
import { ResendInviteDialog } from "./resend-invite-dialog"

function matchesApplicationFilter(
  application: (typeof MOCK_APPLICATIONS)[number],
  filter: ApplicationFilter
) {
  if (filter === "all") return true
  return application.status === filter
}

function matchesInviteFilter(
  invite: (typeof MOCK_INVITES)[number],
  filter: InviteFilter
) {
  if (filter === "all") return true
  return invite.status === filter
}

export function OnboardingPage({ role }: { role: WorkspaceRoleId }) {
  const [activeView, setActiveView] = useState<OnboardingView>("applications")
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationFilter>("all")
  const [inviteFilter, setInviteFilter] = useState<InviteFilter>("all")
  const [applicationSearch, setApplicationSearch] = useState("")
  const [inviteSearch, setInviteSearch] = useState("")
  const [onboardOpen, setOnboardOpen] = useState(false)
  const [resendInvite, setResendInvite] = useState<
    (typeof MOCK_INVITES)[number] | null
  >(null)

  const filteredApplications = useMemo(() => {
    const query = applicationSearch.trim().toLowerCase()

    return MOCK_APPLICATIONS.filter((application) => {
      if (!matchesApplicationFilter(application, applicationFilter))
        return false
      if (!query) return true

      const haystack =
        `${application.name} ${application.email} ${application.username} ${application.location}`.toLowerCase()

      return haystack.includes(query)
    })
  }, [applicationFilter, applicationSearch])

  const filteredInvites = useMemo(() => {
    const query = inviteSearch.trim().toLowerCase()

    return MOCK_INVITES.filter((invite) => {
      if (!matchesInviteFilter(invite, inviteFilter)) return false
      if (!query) return true
      return invite.email.toLowerCase().includes(query)
    })
  }, [inviteFilter, inviteSearch])

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <OnboardingPageHeader onOnboardCreator={() => setOnboardOpen(true)} />

      <OnboardingStatCards
        applications={MOCK_APPLICATIONS}
        invites={MOCK_INVITES}
      />

      <OnboardingViewToggle active={activeView} onChange={setActiveView} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          {activeView === "applications" ? (
            <>
              <ApplicationsToolbar
                activeFilter={applicationFilter}
                onFilterChange={setApplicationFilter}
                search={applicationSearch}
                onSearchChange={setApplicationSearch}
              />
              <ApplicationsTable
                applications={filteredApplications}
                role={role}
              />
            </>
          ) : (
            <>
              <InvitesToolbar
                activeFilter={inviteFilter}
                onFilterChange={setInviteFilter}
                search={inviteSearch}
                onSearchChange={setInviteSearch}
              />
              <InvitesTable
                invites={filteredInvites}
                onResend={setResendInvite}
              />
            </>
          )}
        </CardContent>
      </Card>

      <OnboardCreatorDialog open={onboardOpen} onOpenChange={setOnboardOpen} />

      <ResendInviteDialog
        open={resendInvite !== null}
        onOpenChange={(open) => {
          if (!open) setResendInvite(null)
        }}
        inviteEmail={resendInvite?.email ?? ""}
        displayName={
          resendInvite?.email === "fola@futurefilms.co"
            ? "Fola Adeyemi"
            : undefined
        }
      />
    </div>
  )
}
