import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { ShieldCheck, X } from "lucide-react"
import { useEffect } from "react"

interface CreatorVerifyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  creatorName: string
  creatorEmail: string
  creatorUsername: string
  onConfirm?: () => void
}

export function CreatorVerifyDialog({
  open,
  onOpenChange,
  creatorName,
  creatorEmail,
  creatorUsername,
  onConfirm,
}: CreatorVerifyDialogProps) {
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
        aria-labelledby="creator-verify-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="creator-verify-title"
              className="font-semibold text-foreground text-lg"
            >
              Verify {creatorName}?
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
            They&apos;ll be given a verified badge as a creator and gain access
            to exclusive publishing tools.
          </p>

          <div
            className={cn(
              "rounded-xl border border-border bg-muted/40 px-4 py-3"
            )}
          >
            <p className="font-medium text-foreground text-sm">{creatorName}</p>
            <p className="text-muted-foreground text-sm">
              {creatorEmail} · {creatorUsername}
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
          <Button type="button" className="gap-2" onClick={handleConfirm}>
            <ShieldCheck className="size-4" aria-hidden />
            Verify creator
          </Button>
        </div>
      </div>
    </div>
  )
}
