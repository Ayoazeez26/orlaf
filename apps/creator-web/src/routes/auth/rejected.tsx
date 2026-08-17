import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"

export const Route = createFileRoute("/auth/rejected")({
  ssr: false,
  component: RejectedPage,
})

function RejectedPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="font-semibold text-xl">Application not approved</h1>
        <p className="mt-3 text-muted-foreground text-sm">
          Your creator application was not approved at this time. You may
          re-apply or contact support for more information.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </div>
    </main>
  )
}
