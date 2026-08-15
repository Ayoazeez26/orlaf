import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface UploadEpisodesStepNavProps {
  onBack: () => void
  onNext: () => void
  nextDisabled?: boolean
  nextDisabledReason?: string | null
  className?: string
}

export function UploadEpisodesStepNav({
  onBack,
  onNext,
  nextDisabled,
  nextDisabledReason,
  className,
}: UploadEpisodesStepNavProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {nextDisabled && nextDisabledReason ? (
        <p className="text-muted-foreground text-sm">{nextDisabledReason}</p>
      ) : null}
      <div className="flex justify-between gap-3">
        <Button variant="outline" className="h-10 px-3" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={onNext} disabled={nextDisabled}>
          Next: Review →
        </Button>
      </div>
    </div>
  )
}

interface UploadReviewStepNavProps {
  onBack: () => void
  className?: string
}

export function UploadReviewStepNav({
  onBack,
  className,
}: UploadReviewStepNavProps) {
  return (
    <div className={cn("flex justify-between", className)}>
      <Button variant="outline" onClick={onBack}>
        ← Back to Episodes
      </Button>
    </div>
  )
}
