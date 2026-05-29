import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { FolderKanban } from "lucide-react"
import type { DashboardProject } from "../../types"
import { ProjectRow } from "./project-row"

interface RecentProjectsCardProps {
  projects: DashboardProject[]
}

export function RecentProjectsCard({ projects }: RecentProjectsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="size-5 text-muted-foreground" aria-hidden />
          <p className="font-semibold text-foreground text-sm">
            Recent Projects
          </p>
        </div>
        <Link
          to="/dashboard/projects"
          className="font-medium text-primary text-sm hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-[320px] overflow-y-auto pr-1 pb-3">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
