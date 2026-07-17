import { Button } from "@workspace/ui/components/button"
import { RotateCcw } from "lucide-react"

interface OnboardingErrorNoticeProps {
  message: string
  onRetry: () => void
  retrying?: boolean
}

/**
 * Inline save-error notice with a "Try again" affordance. Selections are
 * preserved, so retrying re-runs the failed save without losing progress.
 */
export function OnboardingErrorNotice({
  message,
  onRetry,
  retrying = false,
}: OnboardingErrorNoticeProps) {
  return (
    <div
      role="alert"
      className="mt-4 flex flex-col gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-destructive text-sm">{message}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0 gap-1.5"
        onClick={onRetry}
        disabled={retrying}
      >
        <RotateCcw className="size-3.5" aria-hidden />
        {retrying ? "Retrying…" : "Try again"}
      </Button>
    </div>
  )
}
