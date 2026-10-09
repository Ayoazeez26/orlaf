import { Button } from "@workspace/ui/components/button"
import { UserX } from "lucide-react"

interface SignupsPausedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignupsPausedModal({
  open,
  onOpenChange,
}: SignupsPausedModalProps) {
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
        aria-labelledby="signups-paused-title"
        className="relative z-10 flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-xl"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <UserX className="size-5 text-muted-foreground" aria-hidden />
        </div>
        <h2
          id="signups-paused-title"
          className="font-semibold text-foreground text-lg"
        >
          Sign-ups are paused
        </h2>
        <p className="text-muted-foreground text-sm">
          New sign-ups are not allowed at the moment. Please check back shortly.
        </p>
        <Button
          type="button"
          className="mt-2 w-full"
          onClick={() => onOpenChange(false)}
        >
          Got it
        </Button>
      </div>
    </div>
  )
}
