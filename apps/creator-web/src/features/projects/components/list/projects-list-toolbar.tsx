import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { LayoutGrid, LayoutList, Plus, Search, SlidersHorizontal } from "lucide-react"

interface ProjectsListToolbarProps {
  layout: "grid" | "list"
  onLayoutChange: (layout: "grid" | "list") => void
}

export function ProjectsListToolbar({
  layout,
  onLayoutChange,
}: ProjectsListToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Search projects"
        className="bg-card text-muted-foreground"
      >
        <Search className="size-4" aria-hidden />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Filter projects"
        className="bg-card text-muted-foreground"
      >
        <SlidersHorizontal className="size-4" aria-hidden />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label={layout === "grid" ? "Switch to list view" : "Switch to grid view"}
        aria-pressed={layout === "grid"}
        onClick={() => onLayoutChange(layout === "grid" ? "list" : "grid")}
        className="bg-card text-muted-foreground"
      >
        {layout === "grid" ? (
          <LayoutList className="size-4" aria-hidden />
        ) : (
          <LayoutGrid className="size-4" aria-hidden />
        )}
      </Button>
      <Button asChild>
        <Link to="/dashboard/projects/new" search={{ step: "info" }}>
          <Plus className="size-4" aria-hidden />
          New Series
        </Link>
      </Button>
    </div>
  )
}

export function ProjectsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {(["a", "b", "c", "d"] as const).map((id) => (
        <div key={id} className="animate-pulse space-y-3">
          <div className="aspect-[4/2] rounded-xl bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

interface ProjectsGridProps {
  children: React.ReactNode
  layout: "grid" | "list"
  listContent?: React.ReactNode
}

export function ProjectsGrid({
  children,
  layout,
  listContent,
}: ProjectsGridProps) {
  if (layout === "list" && listContent) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {listContent}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  )
}
