import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface UploadEpisodesStepNavProps {
  onBack: () => void
  onNext: () => void
  className?: string
}

export function UploadEpisodesStepNav({
  onBack,
  onNext,
  className,
}: UploadEpisodesStepNavProps) {
  return (
    <div className={cn("flex justify-between gap-3", className)}>
      <Button variant="outline" className="h-10 px-3" onClick={onBack}>
        ← Back
      </Button>
      <Button onClick={onNext}>Next: Review →</Button>
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
