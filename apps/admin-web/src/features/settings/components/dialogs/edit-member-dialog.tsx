import { AdminRole } from "@sable/contracts"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useUpdateAdminMember } from "../../api/team-hooks"
import {
  TEAM_ROLE_BADGE_CLASS,
  TEAM_ROLE_LABEL,
  TEAM_ROLE_OPTIONS,
} from "../../constants"
import type { TeamMember } from "../../data/mock-settings"
import { useModalShell } from "../use-modal-shell"

interface EditMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TeamMember | null
}

export function EditMemberDialog({
  open,
  onOpenChange,
  member,
}: EditMemberDialogProps) {
  const updateMember = useUpdateAdminMember()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<string>(AdminRole.CONTENT_ADMIN)

  useEffect(() => {
    if (!open || !member) return
    setFirstName(member.firstName)
    setLastName(member.lastName)
    setEmail(member.email)
    setRole(member.role)
  }, [open, member])

  useModalShell(open, onOpenChange)

  if (!open || !member) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-member-title"
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="edit-member-title"
                className="font-semibold text-foreground text-lg"
              >
                Edit team member
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Update profile details or re-assign this member&apos;s role.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/15 font-medium text-primary text-sm">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground text-sm">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-muted-foreground text-xs">{member.email}</p>
              </div>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 font-medium text-xs",
                TEAM_ROLE_BADGE_CLASS[member.role]
              )}
            >
              {TEAM_ROLE_LABEL[member.role]}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-first-name">First name</Label>
              <Input
                id="edit-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-last-name">Last name</Label>
              <Input
                id="edit-last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Role</Label>
            <div className="space-y-2">
              {TEAM_ROLE_OPTIONS.map((option) => {
                const isSelected = role === option.id

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRole(option.id)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <p className="font-medium text-foreground text-sm">
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-muted-foreground text-xs">
                      {option.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-border border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={updateMember.isPending}
            onClick={() => {
              if (!member) return
              void updateMember
                .mutateAsync({
                  id: member.id,
                  body: { role: role as AdminRole },
                })
                .then(() => onOpenChange(false))
            }}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}
