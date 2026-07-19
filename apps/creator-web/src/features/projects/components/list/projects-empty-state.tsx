import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Clapperboard, Plus, Search } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"

interface ProjectsEmptyStateProps {
  variant: "no-projects" | "no-results"
  embedded?: boolean
  onClearFilters?: () => void
  className?: string
}

export function ProjectsEmptyState({
  variant,
  embedded = false,
  onClearFilters,
  className,
}: ProjectsEmptyStateProps) {
  const isNoProjects = variant === "no-projects"
  const Icon = isNoProjects ? Clapperboard : Search

  return (
    <div
      className={cn(
        "flex flex-col items-center px-6 py-16 text-center sm:py-20",
        !embedded && FROSTED_CARD_SURFACE_CLASS,
        embedded && "border-border border-t bg-transparent",
        className
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-7" aria-hidden />
      </span>
      <h2 className="mt-6 font-semibold text-foreground text-xl">
        {isNoProjects ? "No projects yet" : "No matching projects"}
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground text-sm leading-relaxed">
        {isNoProjects
          ? "Upload your first vertical series to start tracking performance and managing episodes."
          : "Try a different search term or status filter to find what you're looking for."}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {isNoProjects ? (
          <Button asChild className="gap-2">
            <Link to="/dashboard/projects/new" search={{ step: "info" }}>
              <Plus className="size-4" aria-hidden />
              Upload new series
            </Link>
          </Button>
        ) : (
          onClearFilters && (
            <Button type="button" variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
          )
        )}
      </div>
    </div>
  )
}
