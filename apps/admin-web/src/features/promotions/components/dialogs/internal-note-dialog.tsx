import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useModalShell } from "../use-modal-shell"

interface InternalNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialNote?: string | null
  onSave?: (note: string) => void
}

export function InternalNoteDialog({
  open,
  onOpenChange,
  initialNote,
  onSave,
}: InternalNoteDialogProps) {
  const [note, setNote] = useState("")

  useEffect(() => {
    if (open) setNote(initialNote ?? "")
  }, [open, initialNote])

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
        aria-labelledby="internal-note-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="internal-note-title"
                className="font-semibold text-foreground text-lg"
              >
                Internal note
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Leave context for your team — only admins will see this.
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

        <div className="px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="internal-note" className="sr-only">
              Note
            </Label>
            <Textarea
              id="internal-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="e.g. Creator confirmed budget, monitor CTR on day 3..."
              rows={5}
            />
          </div>
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
              onSave?.(note)
              onOpenChange(false)
            }}
          >
            Save note
          </Button>
        </div>
      </div>
    </div>
  )
}
