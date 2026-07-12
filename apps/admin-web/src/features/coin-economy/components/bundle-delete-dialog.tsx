import { Button } from "@workspace/ui/components/button"
import { Trash2, X } from "lucide-react"
import { useModalShell } from "./use-modal-shell"

interface BundleDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bundleName: string
  onConfirm: () => void
}

export function BundleDeleteDialog({
  open,
  onOpenChange,
  bundleName,
  onConfirm,
}: BundleDeleteDialogProps) {
  useModalShell(open, onOpenChange)

  if (!open) return null

  function handleConfirm() {
    onConfirm()
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
        aria-labelledby="delete-bundle-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="delete-bundle-title"
              className="font-semibold text-foreground text-lg"
            >
              Delete {bundleName} Coin Bundle?
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

        <div className="px-6 py-5">
          <p className="text-muted-foreground text-sm leading-relaxed">
            This coin bundle will be deleted. This action can not be reversed.
            Are you sure?
          </p>
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
            <Trash2 className="size-4" aria-hidden />
            Delete Bundle
          </Button>
        </div>
      </div>
    </div>
  )
}
