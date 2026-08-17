import { Clock } from "lucide-react"

export function PendingApprovalBanner() {
  return (
    <div
      role="status"
      className="border-amber-500/30 border-b bg-amber-500/10 px-4 py-3 sm:px-6"
    >
      <div className="flex items-start gap-3">
        <Clock
          className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400"
          aria-hidden
        />
        <div className="min-w-0 space-y-0.5">
          <p className="font-medium text-foreground text-sm">
            Your account is not approved yet
          </p>
          <p className="text-muted-foreground text-sm">
            You can still create a series — it will go through review. This
            banner will disappear once an admin approves your studio.
          </p>
        </div>
      </div>
    </div>
  )
}
