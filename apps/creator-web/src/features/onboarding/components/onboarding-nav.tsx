import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface OnboardingNavProps {
  onSkip?: () => void
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  showSkip?: boolean
  className?: string
}

export function OnboardingNav({
  onSkip,
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  showSkip = true,
  className,
}: OnboardingNavProps) {
  return (
    <>
      {showSkip && onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className={cn(
            "px-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground",
            className
          )}
        >
          Skip
        </button>
      )}
      {onNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="min-w-24"
        >
          {nextLabel}
        </Button>
      )}
    </>
  )
}
