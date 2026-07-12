import { Button } from "@workspace/ui/components/button"
import { X } from "lucide-react"
import { useModalShell } from "../use-modal-shell"

interface ApproveCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignTitle: string
  onConfirm?: () => void
}

export function ApproveCampaignDialog({
  open,
  onOpenChange,
  campaignTitle,
  onConfirm,
}: ApproveCampaignDialogProps) {
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
        aria-labelledby="approve-campaign-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="approve-campaign-title"
              className="font-semibold text-foreground text-lg"
            >
              Approve this campaign?
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
            <span className="font-medium text-foreground">{campaignTitle}</span>{" "}
            will go live immediately and start spending against the budget.
          </p>
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
            onClick={() => {
              onConfirm?.()
              onOpenChange(false)
            }}
          >
            Approve & go live
          </Button>
        </div>
      </div>
    </div>
  )
}
