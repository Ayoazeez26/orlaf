import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Send, X } from "lucide-react"
import { useModalShell } from "./detail/use-modal-shell"

interface ResendInviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inviteEmail: string
  displayName?: string
  displayHandle?: string
  onConfirm?: () => void
}

export function ResendInviteDialog({
  open,
  onOpenChange,
  inviteEmail,
  displayName,
  displayHandle,
  onConfirm,
}: ResendInviteDialogProps) {
  useModalShell(open, onOpenChange)

  if (!open) return null

  const name = displayName ?? inviteEmail.split("@")[0] ?? inviteEmail

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
        aria-labelledby="resend-invite-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="resend-invite-title"
              className="font-semibold text-foreground text-lg"
            >
              Resend invite to {name}?
            </h2>
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
          <p className="text-muted-foreground text-sm">
            We&apos;ll send another onboarding email to the address on file.
          </p>

          <div
            className={cn(
              "rounded-xl border border-border bg-muted/40 px-4 py-3"
            )}
          >
            <p className="font-medium text-foreground text-sm">{name}</p>
            <p className="text-muted-foreground text-sm">
              {inviteEmail}
              {displayHandle ? ` · ${displayHandle}` : ""}
            </p>
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
            className="gap-2"
            onClick={() => {
              onConfirm?.()
              onOpenChange(false)
            }}
          >
            <Send className="size-4" aria-hidden />
            Resend invite
          </Button>
        </div>
      </div>
    </div>
  )
}
