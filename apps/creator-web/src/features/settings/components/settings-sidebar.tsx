import { Link, useRouterState } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { LogOut } from "lucide-react"
import { useAuth } from "@/features/auth/auth-context"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { SETTINGS_TABS, settingsTabPath } from "../constants"

export function SettingsSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { signOut } = useAuth()

  return (
    <aside className="w-full shrink-0 lg:w-[220px]">
      <nav
        className={`${FROSTED_CARD_SURFACE_CLASS} flex flex-col p-2`}
        aria-label="Settings sections"
      >
        <div className="space-y-0.5">
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
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-medium text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {tab.label}
              </Link>
            )
          })}
        </div>

        <div className="mt-2 border-border border-t pt-2">
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-full justify-start gap-2.5 px-3 font-medium text-destructive text-sm hover:bg-destructive/10 hover:text-destructive"
            onClick={() => void signOut()}
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </Button>
        </div>
      </nav>
    </aside>
  )
}
