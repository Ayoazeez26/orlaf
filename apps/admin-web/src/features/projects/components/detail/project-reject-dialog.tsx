import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useModalShell } from "./use-modal-shell"

interface ProjectRejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectTitle: string
  creatorName: string
  creatorUsername: string
  onConfirm?: () => void
}

export function ProjectRejectDialog({
  open,
  onOpenChange,
  projectTitle,
  creatorName,
  creatorUsername,
  onConfirm,
}: ProjectRejectDialogProps) {
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (open) setReason("")
  }, [open])

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
        aria-labelledby="reject-project-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="reject-project-title"
              className="font-semibold text-foreground text-lg"
            >
              Reject {projectTitle}?
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
            This series will be archived. You can reopen it later if needed.
          </p>

          <div
            className={cn(
              "rounded-xl border border-border bg-muted/40 px-4 py-3"
            )}
          >
            <p className="font-medium text-foreground text-sm">
              {projectTitle}
            </p>
            <p className="text-muted-foreground text-sm">
              by {creatorName} · {creatorUsername}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason (optional)</Label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="State a reason here"
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
          <Button
            type="button"
            className="gap-2 bg-destructive text-white hover:bg-destructive/90"
            onClick={handleConfirm}
          >
            <X className="size-4" aria-hidden />
            Reject project
          </Button>
        </div>
      </div>
    </div>
  )
}
