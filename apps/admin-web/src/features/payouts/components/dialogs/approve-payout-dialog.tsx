import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { CheckCircle2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { formatNaira } from "../../lib/format-naira"
import type { Payout } from "../../types"
import { useModalShell } from "../use-modal-shell"

interface ApprovePayoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payout: Payout | null
  onConfirm?: () => void
}

export function ApprovePayoutDialog({
  open,
  onOpenChange,
  payout,
  onConfirm,
}: ApprovePayoutDialogProps) {
  const [disbursementDate, setDisbursementDate] = useState("2026-05-25")
  const [internalNote, setInternalNote] = useState("")

  useEffect(() => {
    if (open) {
      setDisbursementDate("2026-05-25")
      setInternalNote("")
    }
  }, [open])

  useModalShell(open, onOpenChange)

  if (!open || !payout) return null

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
        aria-labelledby="approve-payout-title"
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="approve-payout-title"
                className="font-semibold text-foreground text-lg"
              >
                Approve & schedule payout
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Review the pending payout and schedule when funds should be
                disbursed to the creator.
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

        <div className="space-y-5 px-6 py-5">
          <div
            className={cn(
              "rounded-xl border border-border bg-muted/40 px-4 py-3"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-foreground text-sm">
                  {payout.creatorName}
                </p>
                <p className="text-muted-foreground text-sm">
                  {payout.creatorEmail}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground text-sm tabular-nums">
                  {formatNaira(payout.amount)}
                </p>
                <p className="text-muted-foreground text-xs">{payout.cycle}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-4 text-muted-foreground text-xs">
              <span>{payout.reference}</span>
              <span>Bank — {payout.method}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="disbursement-date">
              Scheduled disbursement date
            </Label>
            <Input
              id="disbursement-date"
              type="date"
              value={disbursementDate}
              onChange={(event) => setDisbursementDate(event.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payout-internal-note">
              Internal note (optional)
            </Label>
            <Textarea
              id="payout-internal-note"
              value={internalNote}
              onChange={(event) => setInternalNote(event.target.value)}
              placeholder="e.g. Verified KYC and bank details."
              rows={3}
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
            className="gap-2"
            onClick={() => {
              onConfirm?.()
              onOpenChange(false)
            }}
          >
            <CheckCircle2 className="size-4" aria-hidden />
            Approve & schedule
          </Button>
        </div>
      </div>
    </div>
  )
}
