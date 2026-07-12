import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useModalShell } from "./use-modal-shell"

const DEFAULT_NOTE =
  "Content reviewed and action taken per Sable TV community guidelines."

interface ReportModerationActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportTitle: string
  contentType: string
}

export function ReportModerationActionDialog({
  open,
  onOpenChange,
  reportTitle,
  contentType,
}: ReportModerationActionDialogProps) {
  const [action, setAction] = useState("warn-creator")
  const [note, setNote] = useState(DEFAULT_NOTE)

  useEffect(() => {
    if (open) {
      setAction("warn-creator")
      setNote(DEFAULT_NOTE)
    }
  }, [open])

  useModalShell(open, onOpenChange)

  if (!open) return null

  function handleConfirm() {
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
        aria-labelledby="moderation-action-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="moderation-action-title"
                className="font-semibold text-foreground text-lg"
              >
                Take moderation action
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Apply an enforcement action for this report.
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
          <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
            <p className="font-medium text-foreground text-sm">{reportTitle}</p>
            <p className="text-muted-foreground text-sm">{contentType}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moderation-action">Action</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger id="moderation-action">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warn-creator">Warn creator</SelectItem>
                <SelectItem value="hide-content">Hide content</SelectItem>
                <SelectItem value="suspend-content">Suspend content</SelectItem>
                <SelectItem value="suspend-user">Suspend user</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moderation-note">Internal note (optional)</Label>
            <Textarea
              id="moderation-note"
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
          <Button type="button" onClick={handleConfirm}>
            Apply action
          </Button>
        </div>
      </div>
    </div>
  )
}
