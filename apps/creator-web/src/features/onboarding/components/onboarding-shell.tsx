import { cn } from "@workspace/ui/lib/utils"
import { ChevronLeft } from "lucide-react"
import type { ReactNode } from "react"
import { OnboardingProgress } from "./onboarding-progress"

interface OnboardingShellProps {
  children: ReactNode
  progress: { currentIndex: number; total: number }
  showBack?: boolean
  onBack?: () => void
  footer?: ReactNode
  className?: string
  wide?: boolean
}

export function OnboardingShell({
  children,
  progress,
  showBack = false,
  onBack,
  footer,
  className,
  wide = false,
}: OnboardingShellProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8 sm:py-10">
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8",
          wide && "max-w-3xl",
          className
        )}
      >
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Back
          </button>
        )}
        {children}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <OnboardingProgress
            currentIndex={progress.currentIndex}
            total={progress.total}
          />
          {footer && (
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
