import { cn } from "@workspace/ui/lib/utils"

interface OnboardingProgressProps {
  currentIndex: number
  total: number
}

export function OnboardingProgress({
  currentIndex,
  total,
}: OnboardingProgressProps) {
  return (
    <nav
      className="flex items-center gap-1.5"
      aria-label={`Step ${currentIndex} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const isActive = step === currentIndex
        return (
          <div
            key={step}
            className={cn(
              "rounded-full transition-all",
              isActive ? "h-2 w-6 bg-primary" : "size-2 bg-muted-foreground/30"
            )}
          />
        )
      })}
    </nav>
  )
}
