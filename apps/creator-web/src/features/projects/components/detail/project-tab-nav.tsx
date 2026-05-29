import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { BarChart3, Info, List, Settings } from "lucide-react"
import { SCROLLABLE_TAB_NAV_CLASS } from "@/lib/scrollable-tab-nav"
import { projectDetailPath } from "../../constants"

const TABS = [
  { id: "overview", label: "Overview", icon: Info, path: "" },
  { id: "episodes", label: "Episodes", icon: List, path: "episodes" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "analytics" },
  { id: "settings", label: "Settings", icon: Settings, path: "settings" },
] as const

interface ProjectTabNavProps {
  projectId: string
}

export function ProjectTabNav({ projectId }: ProjectTabNavProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <nav
      className={SCROLLABLE_TAB_NAV_CLASS}
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
              "inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-colors",
              isActive
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
