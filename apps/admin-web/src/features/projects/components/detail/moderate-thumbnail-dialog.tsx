import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useModalShell } from "./use-modal-shell"

const THUMBNAIL_ACTIONS = [
  {
    id: "request-new",
    label: "Request new thumbnail",
    description: "Flag the asset and ask the creator to upload a replacement.",
  },
  {
    id: "remove",
    label: "Remove thumbnail",
    description:
      "Take the thumbnail down immediately and hide the series cover.",
  },
  {
    id: "warning",
    label: "Send warning only",
    description: "Notify the creator without removing the asset.",
  },
] as const

type ThumbnailAction = (typeof THUMBNAIL_ACTIONS)[number]["id"]

interface ModerateThumbnailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectTitle: string
  onConfirm?: (action: ThumbnailAction, note: string) => void
}

export function ModerateThumbnailDialog({
  open,
  onOpenChange,
  projectTitle,
  onConfirm,
}: ModerateThumbnailDialogProps) {
  const [action, setAction] = useState<ThumbnailAction>("request-new")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (open) {
      setAction("request-new")
      setNote("")
    }
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
        aria-labelledby="moderate-thumbnail-title"
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="moderate-thumbnail-title"
                className="font-semibold text-foreground text-lg"
              >
                Moderate thumbnail
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Choose an action if the thumbnail violates Sable TV guidelines.
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
          <p className="text-muted-foreground text-sm">
            <span className="font-medium text-foreground">{projectTitle}</span>
          </p>

          <div className="space-y-2">
            {THUMBNAIL_ACTIONS.map((option) => {
              const isSelected = action === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAction(option.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <p className="font-medium text-foreground text-sm">
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-muted-foreground text-xs">
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail-note">Note to creator (optional)</Label>
            <Textarea
              id="thumbnail-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Reference the guideline that was violated."
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
            onClick={() => {
              onConfirm?.(action, note)
              onOpenChange(false)
            }}
          >
            Apply action
          </Button>
        </div>
      </div>
    </div>
  )
}
