import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Plus } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { DashboardProject } from "../../types"
import { ProjectRow } from "./project-row"

interface RecentProjectsCardProps {
  projects: DashboardProject[]
  isLoading?: boolean
  isError?: boolean
}

const RECENT_PROJECTS_SKELETON_IDS = [
  "recent-project-skeleton-1",
  "recent-project-skeleton-2",
  "recent-project-skeleton-3",
] as const

function RecentProjectsSkeleton() {
  return (
    <div className="space-y-4">
      {RECENT_PROJECTS_SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="flex animate-pulse items-center gap-4 border-border border-b py-4 last:border-b-0"
        >
          <div className="h-[70px] w-12 shrink-0 rounded-xl bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-2/5 rounded bg-muted" />
            <div className="h-3 w-3/5 rounded bg-muted" />
          </div>
          <div className="hidden h-4 w-16 rounded bg-muted sm:block" />
          <div className="h-7 w-20 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  )
}

function RecentProjectsEmpty() {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <p className="font-medium text-foreground text-sm">No projects yet</p>
      <p className="mt-1 max-w-xs text-muted-foreground text-sm">
        Upload your first series to see it here.
      </p>
      <Button asChild className="mt-5 gap-2">
        <Link to="/dashboard/projects/new" search={{ step: "info" }}>
          <Plus className="size-4" aria-hidden />
          New Project
        </Link>
      </Button>
    </div>
  )
}

export function RecentProjectsCard({
  projects,
  isLoading = false,
  isError = false,
}: RecentProjectsCardProps) {
  return (
    <Card className={FROSTED_CARD_SURFACE_CLASS}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <p className="font-semibold text-foreground">Recent Projects</p>
        <Link
          to="/dashboard/projects"
          className="font-medium text-primary text-sm hover:underline"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? <RecentProjectsSkeleton /> : null}
        {!isLoading && isError ? (
          <p className="py-8 text-center text-muted-foreground text-sm">
            Could not load projects. Please try again.
          </p>
        ) : null}
        {!isLoading && !isError && projects.length === 0 ? (
          <RecentProjectsEmpty />
        ) : null}
        {!isLoading && !isError
          ? projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))
          : null}
      </CardContent>
    </Card>
  )
}
