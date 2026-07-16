import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { getNavHref, getNavLinkTarget } from "../../lib/nav-routes"
import type { NavGroup, WorkspaceRoleId } from "../../types"

interface DashboardNavProps {
  role: WorkspaceRoleId
  groups: NavGroup[]
  onNavigate?: () => void
}

export function DashboardNav({ role, groups, onNavigate }: DashboardNavProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <nav className="flex flex-col gap-6">
      {groups.map((group, index) => (
        <div key={group.label ?? index} className="space-y-1">
          {group.label && (
            <p className="px-3 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
              {group.label}
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isHome = item.key === "home"
              const href = getNavHref(role, item.key)
              const target = getNavLinkTarget(item.key)
              const isActive =
                pathname === href ||
                (!isHome && pathname.startsWith(`${href}/`))
              const Icon = item.icon

              const sharedClassName = cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )

              return (
                <Link
                  key={item.key}
                  to={target.to}
                  params={target.params(role)}
                  activeOptions={isHome ? { exact: true } : undefined}
                  onClick={onNavigate}
                  className={sharedClassName}
                >
                  <Icon className="size-[18px] shrink-0" aria-hidden />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}
