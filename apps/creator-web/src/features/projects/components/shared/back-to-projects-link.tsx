import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

interface BackToProjectsLinkProps {
  projectId?: string
  label?: string
}

export function BackToProjectsLink({
  projectId,
  label,
}: BackToProjectsLinkProps) {
  if (projectId) {
    return (
      <Link
        to="/dashboard/projects/$projectId"
        params={{ projectId }}
        className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        {label ?? "Back to Project"}
      </Link>
    )
  }

  return (
    <Link
      to="/dashboard/projects"
      className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
    >
      <ChevronLeft className="size-4" aria-hidden />
      {label ?? "Back to Projects"}
    </Link>
  )
}
