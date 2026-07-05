import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { X } from "lucide-react"
import { type ReactNode, useEffect } from "react"

interface SettingsModalShellProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer: ReactNode
  className?: string
}

export function SettingsModalShell({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: SettingsModalShellProps) {
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
        aria-labelledby="settings-modal-title"
        className={cn(
          "relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl",
          className
        )}
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2
                id="settings-modal-title"
                className="font-semibold text-foreground text-lg"
              >
                {title}
              </h2>
              {description ? (
                <p className="text-muted-foreground text-sm">{description}</p>
              ) : null}
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

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        <div className="border-border border-t px-6 py-4">{footer}</div>
      </div>
    </div>
  )
}
