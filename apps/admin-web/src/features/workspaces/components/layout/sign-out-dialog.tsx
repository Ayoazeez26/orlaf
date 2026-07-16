import { Button } from "@workspace/ui/components/button"
import { LogOut, X } from "lucide-react"
import { useEffect } from "react"

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  onConfirm?: () => void
}

export function SignOutDialog({
  open,
  onOpenChange,
  userName,
  onConfirm,
}: SignOutDialogProps) {
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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-out-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="sign-out-title"
              className="font-semibold text-foreground text-lg"
            >
              Sign out?
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

        <div className="space-y-3 px-6 py-5">
          <p className="text-muted-foreground text-sm">
            You&apos;ll leave the {userName} workspace and return to the sign-in
            page.
          </p>
          <p className="text-muted-foreground text-sm">
            Any unsaved changes in open tabs will be lost.
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
            variant="destructive"
            className="gap-2"
            onClick={() => {
              onConfirm?.()
              onOpenChange(false)
            }}
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
