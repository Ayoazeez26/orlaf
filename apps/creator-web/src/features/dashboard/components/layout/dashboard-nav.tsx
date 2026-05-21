import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { DASHBOARD_NAV_ITEMS } from "../../constants"

export function DashboardNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <nav className="flex flex-col gap-1">
      {DASHBOARD_NAV_ITEMS.map((item) => {
        const isActive =
          item.to === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.to)
        const Icon = item.icon

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
