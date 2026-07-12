import { Button } from "@workspace/ui/components/button"
import { Pause, Play, X } from "lucide-react"
import { useModalShell } from "../use-modal-shell"

interface PauseCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignTitle: string
  action: "pause" | "resume"
  onConfirm?: () => void
}

export function PauseCampaignDialog({
  open,
  onOpenChange,
  campaignTitle,
  action,
  onConfirm,
}: PauseCampaignDialogProps) {
  useModalShell(open, onOpenChange)

  if (!open) return null

  const isPause = action === "pause"

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
        aria-labelledby="pause-campaign-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="pause-campaign-title"
              className="font-semibold text-foreground text-lg"
            >
              {isPause ? "Pause this campaign?" : "Resume this campaign?"}
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
            {isPause
              ? "Delivery stops until you resume it. Spend will pause as well."
              : "Delivery will restart and spend will resume against the budget."}
          </p>
          <p className="text-foreground text-sm">
            <span className="font-medium">{campaignTitle}</span>
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
            className="gap-2"
            onClick={() => {
              onConfirm?.()
              onOpenChange(false)
            }}
          >
            {isPause ? (
              <>
                <Pause className="size-4" aria-hidden />
                Pause campaign
              </>
            ) : (
              <>
                <Play className="size-4" aria-hidden />
                Resume campaign
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
