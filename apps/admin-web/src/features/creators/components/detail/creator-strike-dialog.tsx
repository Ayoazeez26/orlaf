import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { AlertTriangle, X } from "lucide-react"
import { useEffect, useState } from "react"

const QUICK_TEMPLATES = [
  "Community guidelines violation",
  "Repeated copyright claims",
  "Harassment in comments",
]

interface CreatorStrikeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  creatorName: string
  isSubmitting?: boolean
  onConfirm: (reason: string) => void
}

export function CreatorStrikeDialog({
  open,
  onOpenChange,
  creatorName,
  isSubmitting,
  onConfirm,
}: CreatorStrikeDialogProps) {
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false)
    }

    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, onOpenChange])

  useEffect(() => {
    if (!open) setReason("")
  }, [open])

  if (!open) return null

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
        aria-labelledby="creator-strike-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2
                id="creator-strike-title"
                className="font-semibold text-foreground text-lg"
              >
                Issue a strike to {creatorName}
              </h2>
              <p className="text-muted-foreground text-sm">
                Reaching the strike threshold configured in Settings →
                Moderation auto-suspends the account.
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

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="creator-strike-reason">Reason</Label>
            <Textarea
              id="creator-strike-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Describe the guideline violation..."
              rows={4}
              className="min-h-24 resize-none"
            />
          </div>

          <div className="space-y-2.5">
            <p className="font-medium text-foreground text-sm">
              Quick templates
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TEMPLATES.map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => setReason(template)}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1.5 font-medium text-foreground text-xs transition-colors hover:bg-muted"
                >
                  {template}
                </button>
              ))}
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
            className="gap-2 bg-destructive text-white hover:bg-destructive/90"
            disabled={!reason.trim() || isSubmitting}
            onClick={() => onConfirm(reason.trim())}
          >
            <AlertTriangle className="size-4" aria-hidden />
            {isSubmitting ? "Issuing…" : "Issue strike"}
          </Button>
        </div>
      </div>
    </div>
  )
}
