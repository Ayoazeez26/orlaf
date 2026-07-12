import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import type { NavGroup, WorkspaceRoleId } from "../../types"

interface DashboardNavProps {
  role: WorkspaceRoleId
  groups: NavGroup[]
  onNavigate?: () => void
}

export function DashboardNav({ role, groups, onNavigate }: DashboardNavProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const basePath = `/workspace/${role}`

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
              const href = isHome ? basePath : `${basePath}/${item.key}`
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

              return isHome ? (
                <Link
                  key={item.key}
                  to="/workspace/$role"
                  params={{ role }}
                  activeOptions={{ exact: true }}
                  onClick={onNavigate}
                  className={sharedClassName}
                >
                  <Icon className="size-[18px] shrink-0" aria-hidden />
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.key}
                  to="/workspace/$role/$"
                  params={{ role, _splat: item.key }}
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
