import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { REVENUE_TABS, revenueTabPath } from "../constants"

export function RevenueTabNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <nav className="flex flex-wrap gap-1" aria-label="Revenue sections">
      {REVENUE_TABS.map((tab) => {
        const link = revenueTabPath(tab.path)
        const isActive =
          tab.path === ""
            ? pathname === "/dashboard/revenue" ||
              pathname === "/dashboard/revenue/"
            : pathname.endsWith(`/${tab.path}`)

        const Icon = tab.icon

        return (
          <Link
            key={tab.id}
            to={link.to}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-colors",
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
