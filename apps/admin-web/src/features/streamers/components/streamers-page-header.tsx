import { Button } from "@workspace/ui/components/button"
import { ChevronDown } from "lucide-react"

export function StreamersPageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Streamers
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          All Sable TV streamers — viewers consuming content across plans and
          regions.
        </p>
      </div>
      <Button type="button" variant="outline" className="shrink-0 gap-2">
        Last 30 days
        <ChevronDown className="size-4" aria-hidden />
      </Button>
    </div>
  )
}
