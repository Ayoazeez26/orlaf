import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { Ban, X } from "lucide-react"
import { useEffect, useState } from "react"

export type CreatorSuspendDuration = "24h" | "7d" | "30d" | "permanent"

const DURATION_OPTIONS: { id: CreatorSuspendDuration; label: string }[] = [
  { id: "24h", label: "24 hours" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "permanent", label: "Permanently" },
]

const QUICK_TEMPLATES = [
  "Policy violation",
  "Copyright claim",
  "Duplicate upload",
]

interface CreatorSuspendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  creatorName: string
  onConfirm?: (payload: {
    duration: CreatorSuspendDuration
    reason: string
  }) => void
}

export function CreatorSuspendDialog({
  open,
  onOpenChange,
  creatorName,
  onConfirm,
}: CreatorSuspendDialogProps) {
  const [duration, setDuration] = useState<CreatorSuspendDuration>("7d")
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
    if (!open) {
      setDuration("7d")
      setReason("")
    }
  }, [open])

  if (!open) return null

  function handleConfirm() {
    onConfirm?.({ duration, reason })
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
        aria-labelledby="creator-suspend-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2
                id="creator-suspend-title"
                className="font-semibold text-foreground text-lg"
              >
                Suspend {creatorName}
              </h2>
              <p className="text-muted-foreground text-sm">
                The creator will lose access to publishing and payouts for the
                selected period.
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
          <div className="space-y-3">
            <Label>Duration</Label>
            <div className="grid grid-cols-2 gap-3">
              {DURATION_OPTIONS.map((option) => {
                const isSelected = duration === option.id

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDuration(option.id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-left font-medium text-foreground text-sm transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-muted/40"
                    )}
                  >
                    {option.label}
                    <span
                      className={cn(
                        "size-4 shrink-0 rounded-full border-2",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/40"
                      )}
                      aria-hidden
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creator-suspend-reason">Reason (optional)</Label>
            <Textarea
              id="creator-suspend-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Add an internal note for the audit log..."
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
            onClick={handleConfirm}
          >
            <Ban className="size-4" aria-hidden />
            Suspend creator
          </Button>
        </div>
      </div>
    </div>
  )
}
