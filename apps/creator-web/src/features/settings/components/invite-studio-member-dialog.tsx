import type { StudioTeamRole } from "@sable/contracts"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useEffect, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import { useInviteStudioMember } from "../api/team-hooks"
import { SettingsModalShell } from "./settings-modal-shell"

const ROLES: Exclude<StudioTeamRole, "owner">[] = ["admin", "editor", "viewer"]

interface InviteStudioMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteStudioMemberDialog({
  open,
  onOpenChange,
}: InviteStudioMemberDialogProps) {
  const invite = useInviteStudioMember()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Exclude<StudioTeamRole, "owner">>("editor")

  useEffect(() => {
    if (!open) return
    setEmail("")
    setRole("editor")
  }, [open])

  return (
    <SettingsModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Invite team member"
      description="They must already have a creator account on this email."
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!email.trim() || invite.isPending}
            onClick={async () => {
              try {
                await invite.mutateAsync({ email: email.trim(), role })
                toast.success("Invite sent.")
                onOpenChange(false)
              } catch (error) {
                toastMutationError(error, "Failed to send invite")
              }
            }}
          >
            Send invite
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studio-invite-email">Email</Label>
          <Input
            id="studio-invite-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="creator@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select
            value={role}
            onValueChange={(value) =>
              setRole(value as Exclude<StudioTeamRole, "owner">)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </SettingsModalShell>
  )
}
