import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { DashboardProject } from "../../types"
import { ProjectRow } from "./project-row"

interface RecentProjectsCardProps {
  projects: DashboardProject[]
}

export function RecentProjectsCard({ projects }: RecentProjectsCardProps) {
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
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </CardContent>
    </Card>
  )
}
