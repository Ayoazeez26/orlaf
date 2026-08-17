import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"

export const Route = createFileRoute("/auth/suspended")({
  ssr: false,
  component: SuspendedPage,
})

function SuspendedPage() {
  return (
    <AuthStatusPage
      title="Account suspended"
      description="Your creator account has been suspended. Contact support if you believe this is a mistake."
    />
  )
}

function AuthStatusPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="font-semibold text-xl">{title}</h1>
        <p className="mt-3 text-muted-foreground text-sm">{description}</p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </div>
    </main>
  )
}

export { AuthStatusPage }
