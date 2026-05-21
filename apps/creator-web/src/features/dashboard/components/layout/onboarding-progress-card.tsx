import { cn } from "@workspace/ui/lib/utils"
import { ChevronRight } from "lucide-react"
import type { DashboardOnboardingProgress } from "../../types"

interface OnboardingProgressCardProps {
  progress: DashboardOnboardingProgress
  className?: string
}

export function OnboardingProgressCard({
  progress,
  className,
}: OnboardingProgressCardProps) {
  const circumference = 2 * Math.PI * 18
  const offset = circumference - (progress.percent / 100) * circumference

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-left transition-colors hover:bg-primary/10",
        className
      )}
    >
      <div className="relative size-11 shrink-0">
        <svg
          className="size-11 -rotate-90"
          viewBox="0 0 44 44"
          role="img"
          aria-label={`${progress.percent}% progress`}
        >
          <title>{`${progress.percent}% progress`}</title>
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary/20"
          />
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-semibold text-primary text-xs">
          {progress.percent}%
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground text-sm">
          {progress.title}
        </p>
        <p className="text-muted-foreground text-xs">{progress.subtitle}</p>
      </div>
      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden
      />
    </button>
  )
}
