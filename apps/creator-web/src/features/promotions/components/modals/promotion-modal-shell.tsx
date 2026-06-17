import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { X } from "lucide-react"
import { type ReactNode, useEffect } from "react"

interface PromotionModalShellProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  step?: { current: number; total: number; label: string }
  children: ReactNode
  footer: ReactNode
  className?: string
}

export function PromotionModalShell({
  open,
  onOpenChange,
  title,
  subtitle,
  step,
  children,
  footer,
  className,
}: PromotionModalShellProps) {
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
        aria-labelledby="promotion-modal-title"
        className={cn(
          "relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl",
          className
        )}
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2
                id="promotion-modal-title"
                className="font-semibold text-foreground text-lg"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-muted-foreground text-sm">{subtitle}</p>
              )}
              {step && (
                <p className="text-muted-foreground text-sm">
                  Step {step.current} of {step.total} · {step.label}
                </p>
              )}
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
          {step && (
            <div className="mt-4 flex gap-1">
              {Array.from({ length: step.total }, (_, index) => index + 1).map(
                (segment) => (
                  <div
                    key={segment}
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      segment <= step.current ? "bg-primary" : "bg-muted"
                    )}
                  />
                )
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        <div className="border-border border-t px-6 py-4">{footer}</div>
      </div>
    </div>
  )
}
