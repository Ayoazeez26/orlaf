import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Check, X } from "lucide-react"
import { useModalShell } from "./use-modal-shell"

interface ApplicationApproveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicantName: string
  applicantEmail: string
  applicantUsername: string
  onConfirm?: () => void
}

export function ApplicationApproveDialog({
  open,
  onOpenChange,
  applicantName,
  applicantEmail,
  applicantUsername,
  onConfirm,
}: ApplicationApproveDialogProps) {
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
        aria-labelledby="approve-application-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="approve-application-title"
              className="font-semibold text-foreground text-lg"
            >
              Approve {applicantName}?
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
            They&apos;ll be onboarded as a creator and gain access to publishing
            tools.
          </p>

          <div
            className={cn(
              "rounded-xl border border-border bg-muted/40 px-4 py-3"
            )}
          >
            <p className="font-medium text-foreground text-sm">
              {applicantName}
            </p>
            <p className="text-muted-foreground text-sm">
              {applicantEmail} · {applicantUsername}
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
            <Check className="size-4" aria-hidden />
            Approve creator
          </Button>
        </div>
      </div>
    </div>
  )
}
