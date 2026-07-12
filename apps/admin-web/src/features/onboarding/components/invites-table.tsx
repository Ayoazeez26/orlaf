import { Button } from "@workspace/ui/components/button"
import type { OnboardingInvite } from "../types"
import { InviteStatusBadge } from "./onboarding-badges"

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

interface InvitesTableProps {
  invites: OnboardingInvite[]
  onResend: (invite: OnboardingInvite) => void
}

export function InvitesTable({ invites, onResend }: InvitesTableProps) {
  if (invites.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No invites match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={HEAD_CLASS}>Email</th>
            <th className={HEAD_CLASS}>Status</th>
            <th className={HEAD_CLASS}>Sent by</th>
            <th className={HEAD_CLASS}>Sent</th>
            <th className={HEAD_CLASS}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite) => (
            <tr
              key={invite.id}
              className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
            >
              <td className="px-4 py-3 font-medium text-foreground">
                {invite.email}
              </td>
              <td className="px-4 py-3">
                <InviteStatusBadge status={invite.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {invite.sentBy}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {invite.sent}
              </td>
              <td className="px-4 py-3 text-right">
                {invite.status === "sent" || invite.status === "expired" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onResend(invite)}
                  >
                    Resend
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
