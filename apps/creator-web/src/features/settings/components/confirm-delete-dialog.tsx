import { Button } from "@workspace/ui/components/button"
import { Loader2, Trash2 } from "lucide-react"
import { SettingsModalShell } from "./settings-modal-shell"

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  isPending?: boolean
  onConfirm: () => void | Promise<void>
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  isPending = false,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <SettingsModalShell
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next)
      }}
      title={title}
      description={description}
      footer={
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="gap-2"
            disabled={isPending}
            onClick={() => void onConfirm()}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Trash2 className="size-4" aria-hidden />
            )}
            {isPending ? "Deleting…" : confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="text-muted-foreground text-sm">This cannot be undone.</p>
    </SettingsModalShell>
  )
}
