import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Send, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useModalShell } from "./use-modal-shell"

const DEFAULT_NOTE =
  "We loved your work and would love to have you on Sable TV."

interface OnboardCreatorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultFirstName?: string
  defaultLastName?: string
  defaultEmail?: string
  onConfirm?: () => void
}

export function OnboardCreatorDialog({
  open,
  onOpenChange,
  defaultFirstName = "",
  defaultLastName = "",
  defaultEmail = "",
  onConfirm,
}: OnboardCreatorDialogProps) {
  const [firstName, setFirstName] = useState(defaultFirstName)
  const [lastName, setLastName] = useState(defaultLastName)
  const [email, setEmail] = useState(defaultEmail)
  const [note, setNote] = useState(DEFAULT_NOTE)

  useEffect(() => {
    if (!open) return
    setFirstName(defaultFirstName)
    setLastName(defaultLastName)
    setEmail(defaultEmail)
    setNote(DEFAULT_NOTE)
  }, [open, defaultFirstName, defaultLastName, defaultEmail])

  useModalShell(open, onOpenChange)

  if (!open) return null

  function handleConfirm() {
    onConfirm?.()
    onOpenChange(false)
  }

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
        aria-labelledby="onboard-creator-title"
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="onboard-creator-title"
                className="font-semibold text-foreground text-lg"
              >
                Onboard creator
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Send an invite email with onboarding instructions.
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

        <div className="space-y-4 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="onboard-first-name">First name</Label>
              <Input
                id="onboard-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Jane"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="onboard-last-name">Last name</Label>
              <Input
                id="onboard-last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="onboard-email">Email</Label>
            <Input
              id="onboard-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="creator@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="onboard-note">Personal note (optional)</Label>
            <Textarea
              id="onboard-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
            />
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
          <Button type="button" className="gap-2" onClick={handleConfirm}>
            <Send className="size-4" aria-hidden />
            Send invite
          </Button>
        </div>
      </div>
    </div>
  )
}
