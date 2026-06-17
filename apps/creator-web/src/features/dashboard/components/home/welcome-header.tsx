import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"

interface WelcomeHeaderProps {
  displayName: string
}

export function WelcomeHeader({ displayName }: WelcomeHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Welcome, {displayName}
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Track performance across all your series
        </p>
      </div>
      <Button asChild className="shrink-0 gap-2">
        <Link to="/dashboard/projects/new">
          <Plus className="size-4" aria-hidden />
          New Project
        </Link>
      </Button>
    </div>
  )
}
