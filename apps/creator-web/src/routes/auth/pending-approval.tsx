import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"

export const Route = createFileRoute("/auth/pending-approval")({
  ssr: false,
  component: PendingApprovalPage,
})

function PendingApprovalPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="font-semibold text-xl">Pending approval</h1>
        <p className="mt-3 text-muted-foreground text-sm">
          Your creator account is awaiting review. We&apos;ll notify you once
          your application has been approved.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </main>
  )
}
