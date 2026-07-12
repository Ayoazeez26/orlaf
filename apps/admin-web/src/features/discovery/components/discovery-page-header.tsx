import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"

interface DiscoveryPageHeaderProps {
  onNewRail?: () => void
}

export function DiscoveryPageHeader({ onNewRail }: DiscoveryPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Discovery
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Curate what, when, and where content appears on Home and For You.
        </p>
      </div>
      <Button type="button" className="shrink-0 gap-2" onClick={onNewRail}>
        <Plus className="size-4" aria-hidden />
        New Rail
      </Button>
    </div>
  )
}
