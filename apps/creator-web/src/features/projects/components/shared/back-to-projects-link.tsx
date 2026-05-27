import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

export function BackToProjectsLink() {
  return (
    <Link
      to="/dashboard/projects"
      className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
    >
      <ChevronLeft className="size-4" aria-hidden />
      Back to Projects
    </Link>
  )
}
