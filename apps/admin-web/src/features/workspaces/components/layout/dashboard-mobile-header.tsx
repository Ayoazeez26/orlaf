import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { WorkspaceConfig } from "../../types"
import { DashboardLogo } from "./dashboard-logo"
import { DashboardSidebarContent } from "./dashboard-sidebar-content"

interface DashboardMobileHeaderProps {
  config: WorkspaceConfig
}

export function DashboardMobileHeader({ config }: DashboardMobileHeaderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-3 border-border border-b bg-card px-4 py-3 lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </Button>
        <DashboardLogo subtitle={config.name} className="min-w-0 px-0" />
        <div className="size-9 shrink-0" aria-hidden />
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute top-0 left-0 flex h-full w-[min(100%,20rem)] flex-col overflow-hidden border-border border-r bg-card px-4 py-6 shadow-xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <DashboardSidebarContent
            config={config}
            onNavigate={() => setOpen(false)}
          />
        </aside>
      </div>
    </>
  )
}
