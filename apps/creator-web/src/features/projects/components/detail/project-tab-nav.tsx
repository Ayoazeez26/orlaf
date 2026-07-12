import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { BarChart3, Grid2x2, Info, Settings } from "lucide-react"
import { SCROLLABLE_HORIZONTAL_CLASS } from "@/lib/scrollable-tab-nav"
import { projectDetailPath } from "../../constants"

const TABS = [
  { id: "overview", label: "Overview", icon: Info, path: "" },
  { id: "episodes", label: "Episodes", icon: Grid2x2, path: "episodes" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "analytics" },
  { id: "settings", label: "Settings", icon: Settings, path: "settings" },
] as const

interface ProjectTabNavProps {
  projectId: string
}

export function ProjectTabNav({ projectId }: ProjectTabNavProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className={SCROLLABLE_HORIZONTAL_CLASS}>
      <nav
        className="flex flex-nowrap gap-6 border-border border-b"
        aria-label="Project sections"
      >
        {TABS.map((tab) => {
          const link = projectDetailPath(
            projectId,
            tab.path === "" ? undefined : tab.path
          )
          const isActive =
            tab.path === ""
              ? pathname === `/dashboard/projects/${projectId}` ||
                pathname === `/dashboard/projects/${projectId}/`
              : pathname.endsWith(`/${tab.path}`)

          const Icon = tab.icon

          return (
            <Link
              key={tab.id}
              to={link.to}
              params={link.params}
              className={cn(
                "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-1 pb-3 font-medium text-sm transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" aria-hidden />
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
