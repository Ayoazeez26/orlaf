import type { AdminOnboardingStats } from "@sable/contracts"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useApplicationsQuery,
  useCreateInvite,
  useInvitesQuery,
  useResendInvite,
} from "../api/onboarding-hooks"
import type { ApplicationFilter, InviteFilter } from "../constants"
import { toApplication, toInvite } from "../data/map-onboarding"
import type { OnboardingInvite } from "../types"
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

const EMPTY_STATS: AdminOnboardingStats = {
  pending: 0,
  invited: 0,
  approved: 0,
  rejected: 0,
}

function StateMessage({
  isPending,
  isError,
  error,
  onRetry,
  emptyLabel,
}: {
  isPending: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  emptyLabel: string
}) {
  if (isError) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-muted-foreground text-sm">
          {error instanceof Error ? error.message : emptyLabel}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="text-primary text-sm underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
      {isPending ? "Loading…" : emptyLabel}
    </div>
  )
}

export function OnboardingPage({ role }: { role: WorkspaceRoleId }) {
  const [activeView, setActiveView] = useState<OnboardingView>("applications")
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationFilter>("all")
  const [inviteFilter, setInviteFilter] = useState<InviteFilter>("all")
  const [applicationSearch, setApplicationSearch] = useState("")
  const [inviteSearch, setInviteSearch] = useState("")
  const [onboardOpen, setOnboardOpen] = useState(false)
  const [resendTarget, setResendTarget] = useState<OnboardingInvite | null>(
    null
  )

  const applicationsQuery = useApplicationsQuery({
    filter: applicationFilter,
    q: applicationSearch,
  })
  const invitesQuery = useInvitesQuery({
    filter: inviteFilter,
    q: inviteSearch,
  })
  const createInvite = useCreateInvite()
  const resendInvite = useResendInvite()

  const applications = useMemo(
    () => (applicationsQuery.data?.items ?? []).map(toApplication),
    [applicationsQuery.data]
  )
  const invites = useMemo(
    () => (invitesQuery.data?.items ?? []).map(toInvite),
    [invitesQuery.data]
  )

  const stats =
    applicationsQuery.data?.stats ?? invitesQuery.data?.stats ?? EMPTY_STATS

  const showApplications = activeView === "applications"

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <OnboardingPageHeader onOnboardCreator={() => setOnboardOpen(true)} />

      <OnboardingStatCards stats={stats} />

      <OnboardingViewToggle active={activeView} onChange={setActiveView} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          {showApplications ? (
            <>
              <ApplicationsToolbar
                activeFilter={applicationFilter}
                onFilterChange={setApplicationFilter}
                search={applicationSearch}
                onSearchChange={setApplicationSearch}
              />
              {applications.length > 0 ? (
                <ApplicationsTable applications={applications} role={role} />
              ) : (
                <StateMessage
                  isPending={applicationsQuery.isPending}
                  isError={applicationsQuery.isError}
                  error={applicationsQuery.error}
                  onRetry={() => applicationsQuery.refetch()}
                  emptyLabel="No applications match your filters."
                />
              )}
            </>
          ) : (
            <>
              <InvitesToolbar
                activeFilter={inviteFilter}
                onFilterChange={setInviteFilter}
                search={inviteSearch}
                onSearchChange={setInviteSearch}
              />
              {invites.length > 0 ? (
                <InvitesTable invites={invites} onResend={setResendTarget} />
              ) : (
                <StateMessage
                  isPending={invitesQuery.isPending}
                  isError={invitesQuery.isError}
                  error={invitesQuery.error}
                  onRetry={() => invitesQuery.refetch()}
                  emptyLabel="No invites match your filters."
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <OnboardCreatorDialog
        open={onboardOpen}
        onOpenChange={setOnboardOpen}
        onConfirm={async (payload) => {
          try {
            await createInvite.mutateAsync({
              email: payload.email,
              firstName: payload.firstName || undefined,
              lastName: payload.lastName || undefined,
              note: payload.note || undefined,
            })
            setActiveView("invites")
            toast.success("Invite successfully sent.")
          } catch (error) {
            toastMutationError(error, "Failed to send invite.")
            throw error
          }
        }}
      />

      <ResendInviteDialog
        open={resendTarget !== null}
        onOpenChange={(open) => {
          if (!open) setResendTarget(null)
        }}
        inviteEmail={resendTarget?.email ?? ""}
        onConfirm={() => {
          if (!resendTarget) return
          resendInvite.mutate(resendTarget.id, {
            onSuccess: () => {
              toast.success("Invite successfully resent.")
            },
            onError: (error) => {
              toastMutationError(error, "Failed to resend invite.")
            },
          })
        }}
      />
    </div>
  )
}
