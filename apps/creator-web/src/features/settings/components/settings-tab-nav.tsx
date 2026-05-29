import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { SCROLLABLE_TAB_NAV_CLASS } from "@/lib/scrollable-tab-nav"
import { SETTINGS_TABS, settingsTabPath } from "../constants"

export function SettingsTabNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <nav
      className={SCROLLABLE_TAB_NAV_CLASS}
      aria-label="Settings sections"
    >
      {SETTINGS_TABS.map((tab) => {
        const link = settingsTabPath(tab.path)
        const isActive =
          tab.path === ""
            ? pathname === "/dashboard/settings" ||
              pathname === "/dashboard/settings/"
            : pathname.endsWith(`/${tab.path}`)

        const Icon = tab.icon

        return (
          <Link
            key={tab.id}
            to={link.to}
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
