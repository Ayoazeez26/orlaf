import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useModalShell } from "../use-modal-shell"

interface RejectCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignTitle: string
  creatorName: string
  variant?: "table" | "simple"
  onConfirm?: (note?: string) => void
}

export function RejectCampaignDialog({
  open,
  onOpenChange,
  campaignTitle,
  creatorName,
  variant = "table",
  onConfirm,
}: RejectCampaignDialogProps) {
  const [note, setNote] = useState("")

  useEffect(() => {
    if (open) setNote("")
  }, [open])

  useModalShell(open, onOpenChange)

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
        aria-labelledby="reject-campaign-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="reject-campaign-title"
              className="font-semibold text-foreground text-lg"
            >
              Reject this campaign?
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
            {variant === "table" ? (
              <>
                <span className="font-medium text-foreground">
                  {campaignTitle}
                </span>{" "}
                by {creatorName} will be marked as rejected. The creator will be
                notified.
              </>
            ) : (
              "The creator will be notified and no spend will occur."
            )}
          </p>

          {variant === "simple" ? null : (
            <div className="space-y-2">
              <Label htmlFor="reject-campaign-note">Reason (optional)</Label>
              <Textarea
                id="reject-campaign-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Share feedback with the creator..."
                rows={4}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-border border-t px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={() => {
              onConfirm?.(note.trim() || undefined)
              onOpenChange(false)
            }}
          >
            Reject campaign
          </Button>
        </div>
      </div>
    </div>
  )
}
