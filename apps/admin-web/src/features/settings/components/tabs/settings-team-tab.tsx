import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Pencil, Plus } from "lucide-react"
import { useState } from "react"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import {
  useAdminTeamQuery,
  useResendAdminInvite,
  useRevokeAdminInvite,
} from "../../api/team-hooks"
import { TEAM_ROLE_BADGE_CLASS, TEAM_ROLE_LABEL } from "../../constants"
import type { TeamMember } from "../../data/mock-settings"
import { EditMemberDialog } from "../dialogs/edit-member-dialog"
import { InviteMemberDialog } from "../dialogs/invite-member-dialog"
import { SettingsPanel } from "../settings-shared"

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

export function SettingsTeamTab() {
  const { data, isLoading } = useAdminTeamQuery()
  const revokeInvite = useRevokeAdminInvite()
  const resendInvite = useResendAdminInvite()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [inviteToRevoke, setInviteToRevoke] = useState<{
    id: string
    email: string
  } | null>(null)

  const members: TeamMember[] = (data?.members ?? []).map((member) => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    initials: member.initials,
    role: member.role,
  }))

  return (
    <>
      <SettingsPanel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-base text-foreground tracking-tight">
              Admin members
            </h3>
            <p className="mt-0.5 text-muted-foreground text-sm">
              People who can sign in to the Sable TV admin.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => setInviteOpen(true)}
          >
            <Plus className="size-4" aria-hidden />
            Invite member
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading team…</p>
        ) : (
          <div className="-mx-4 overflow-x-auto sm:-mx-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className={HEAD_CLASS}>Member</th>
                  <th className={HEAD_CLASS}>Role</th>
                  <th className={HEAD_CLASS}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-border/60 border-b last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-primary/15 font-medium text-primary text-xs">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 font-medium text-xs",
                          TEAM_ROLE_BADGE_CLASS[member.role]
                        )}
                      >
                        {TEAM_ROLE_LABEL[member.role] ?? member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {member.role !== "super_admin" ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${member.firstName}`}
                            onClick={() => setEditingMember(member)}
                          >
                            <Pencil className="size-4" aria-hidden />
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(data?.invites.length ?? 0) > 0 ? (
          <div className="mt-6 space-y-2">
            <h4 className="font-medium text-foreground text-sm">
              Pending invites
            </h4>
            <ul className="space-y-1 text-muted-foreground text-sm">
              {data?.invites
                .filter((invite) => invite.status === "sent")
                .map((invite) => (
                  <li
                    key={invite.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span>
                      {invite.email} ·{" "}
                      {TEAM_ROLE_LABEL[invite.role] ?? invite.role}
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={resendInvite.isPending}
                        onClick={() => resendInvite.mutate(invite.id)}
                      >
                        Resend
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={revokeInvite.isPending}
                        onClick={() =>
                          setInviteToRevoke({
                            id: invite.id,
                            email: invite.email,
                          })
                        }
                      >
                        Revoke
                      </Button>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
      </SettingsPanel>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <EditMemberDialog
        open={editingMember !== null}
        onOpenChange={(open) => {
          if (!open) setEditingMember(null)
        }}
        member={editingMember}
      />

      <ConfirmDeleteDialog
        open={inviteToRevoke !== null}
        onOpenChange={(open) => {
          if (!open) setInviteToRevoke(null)
        }}
        title="Revoke this invite?"
        description={`The pending invite to ${inviteToRevoke?.email ?? "this person"} will no longer work.`}
        confirmLabel="Revoke invite"
        isPending={revokeInvite.isPending}
        onConfirm={async () => {
          if (!inviteToRevoke) return
          await revokeInvite.mutateAsync(inviteToRevoke.id)
          setInviteToRevoke(null)
        }}
      />
    </>
  )
}
