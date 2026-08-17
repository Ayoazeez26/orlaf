import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { MoreHorizontal, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useAcceptStudioInvite,
  useRemoveStudioMember,
  useResendStudioInvite,
  useRevokeStudioInvite,
  useStudioTeamQuery,
} from "../api/team-hooks"
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog"
import { InviteStudioMemberDialog } from "../components/invite-studio-member-dialog"
import { SettingsPageSkeleton } from "../components/settings-page-skeleton"
import { SettingsSectionCard } from "../components/settings-section-card"
import { SoloCreatorTeamGate } from "../components/solo-creator-team-gate"
import { useProfile } from "../hooks/use-profile"

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export function SettingsTeamPage() {
  const { data: profile, isLoading: profileLoading } = useProfile()
  const isStudioCreator = profile?.creatorProfile?.creatorType === "studio"
  const { data, isPending } = useStudioTeamQuery(Boolean(isStudioCreator))
  const acceptInvite = useAcceptStudioInvite()
  const resendInvite = useResendStudioInvite()
  const revokeInvite = useRevokeStudioInvite()
  const removeMember = useRemoveStudioMember()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [revokeId, setRevokeId] = useState<{
    id: string
    email: string
  } | null>(null)
  const [removeId, setRemoveId] = useState<{ id: string; name: string } | null>(
    null
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: accept once on mount
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("invite")
    if (!token) return
    void acceptInvite
      .mutateAsync(token)
      .then(() => {
        toast.success("You joined the studio.")
        window.history.replaceState({}, "", "/dashboard/settings/team")
      })
      .catch((error) => {
        toastMutationError(error, "Could not accept invite")
      })
  }, [])

  if (profileLoading || !profile) return <SettingsPageSkeleton />

  if (
    !isStudioCreator &&
    !new URLSearchParams(window.location.search).get("invite")
  ) {
    return <SoloCreatorTeamGate />
  }

  if (isPending || !data) return <SettingsPageSkeleton />

  return (
    <>
      <SettingsSectionCard
        title="Team"
        description={`People with access to ${data.studioName}.`}
        headerAction={
          data.canManage ? (
            <Button
              type="button"
              size="sm"
              className="gap-1.5 rounded-lg"
              onClick={() => setInviteOpen(true)}
            >
              <UserPlus className="size-3.5" aria-hidden />
              Invite members
            </Button>
          ) : null
        }
      >
        <div className="space-y-4">
          <p className="font-medium text-foreground text-sm">
            Members ({data.members.length})
          </p>
          <div className="divide-y rounded-xl border border-border">
            {data.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-3 px-4 py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                    {member.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground text-sm">
                      {member.name}
                    </p>
                    <p className="truncate text-muted-foreground text-xs">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-transparent bg-muted px-2.5 py-1 font-medium text-foreground text-xs"
                  >
                    {roleLabel(member.role)}
                  </Badge>
                  {data.canManage && member.role !== "owner" ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${member.name}`}
                      onClick={() =>
                        setRemoveId({ id: member.id, name: member.name })
                      }
                    >
                      <MoreHorizontal className="size-4" aria-hidden />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {data.invites.length > 0 ? (
            <div className="space-y-2">
              <p className="font-medium text-foreground text-sm">
                Pending invites
              </p>
              <div className="divide-y rounded-xl border border-border">
                {data.invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between gap-3 px-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground text-sm">
                        {invite.email}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {roleLabel(invite.role)} · pending
                      </p>
                    </div>
                    {data.canManage ? (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            void resendInvite
                              .mutateAsync(invite.id)
                              .then(() => toast.success("Invite resent."))
                              .catch((error) =>
                                toastMutationError(error, "Failed to resend")
                              )
                          }
                        >
                          Resend
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setRevokeId({ id: invite.id, email: invite.email })
                          }
                        >
                          Revoke
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </SettingsSectionCard>

      <InviteStudioMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />

      <ConfirmDeleteDialog
        open={Boolean(revokeId)}
        onOpenChange={(open) => {
          if (!open) setRevokeId(null)
        }}
        title="Revoke invite?"
        description={`Revoke the invite to ${revokeId?.email ?? "this email"}?`}
        confirmLabel="Revoke"
        isPending={revokeInvite.isPending}
        onConfirm={async () => {
          if (!revokeId) return
          try {
            await revokeInvite.mutateAsync(revokeId.id)
            toast.success("Invite revoked.")
            setRevokeId(null)
          } catch (error) {
            toastMutationError(error, "Failed to revoke invite")
          }
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(removeId)}
        onOpenChange={(open) => {
          if (!open) setRemoveId(null)
        }}
        title="Remove member?"
        description={`Remove ${removeId?.name ?? "this member"} from the studio?`}
        confirmLabel="Remove"
        isPending={removeMember.isPending}
        onConfirm={async () => {
          if (!removeId) return
          try {
            await removeMember.mutateAsync(removeId.id)
            toast.success("Member removed.")
            setRemoveId(null)
          } catch (error) {
            toastMutationError(error, "Failed to remove member")
          }
        }}
      />
    </>
  )
}
