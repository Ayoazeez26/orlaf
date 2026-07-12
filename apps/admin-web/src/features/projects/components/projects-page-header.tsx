import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"

export function ProjectsPageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Projects
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Review and moderate platform content.
        </p>
      </div>
      <Button type="button" className="shrink-0 gap-2">
        <Plus className="size-4" aria-hidden />
        New Project
      </Button>
    </div>
  )
}
