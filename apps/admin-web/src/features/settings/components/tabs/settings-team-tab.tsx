import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { TEAM_ROLE_BADGE_CLASS, TEAM_ROLE_LABEL } from "../../constants"
import { MOCK_TEAM_MEMBERS, type TeamMember } from "../../data/mock-settings"
import { EditMemberDialog } from "../dialogs/edit-member-dialog"
import { InviteMemberDialog } from "../dialogs/invite-member-dialog"
import { SettingsPanel } from "../settings-shared"

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

export function SettingsTeamTab() {
  const [members] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

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
                      {TEAM_ROLE_LABEL[member.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${member.firstName}`}
                        onClick={() => setEditingMember(member)}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                      {member.role !== "super-admin" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                          aria-label={`Delete ${member.firstName}`}
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsPanel>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <EditMemberDialog
        open={editingMember !== null}
        onOpenChange={(open) => {
          if (!open) setEditingMember(null)
        }}
        member={editingMember}
      />
    </>
  )
}
