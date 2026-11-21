import { AdminRole } from "@sable/contracts"
import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { Bell, Check, CircleHelp, LogOut, Moon, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useAuth } from "@/features/auth/auth-context"
import { WORKSPACE_LIST } from "../../data/roles"
import type { WorkspaceRoleId, WorkspaceUser } from "../../types"
import { SignOutDialog } from "./sign-out-dialog"

interface SidebarUserProfileProps {
  user: WorkspaceUser
  roleName: string
  /** The workspace currently being viewed (not necessarily the admin's own role). */
  roleId: WorkspaceRoleId
  onNavigate?: () => void
}

export function SidebarUserProfile({
  user,
  roleName,
  roleId,
  onNavigate,
}: SidebarUserProfileProps) {
  const { session, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  // Based on the signed-in admin, not the workspace being viewed, so super
  // admins keep their controls while looking at another role's workspace.
  const isSuperAdmin = session?.role === AdminRole.SUPER_ADMIN
  const displayRole = isSuperAdmin ? "Super Admin" : roleName
  const isDark = theme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        className="h-auto w-full justify-start gap-3 rounded-xl px-2 py-3 hover:bg-muted/60"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="bg-primary/15 font-medium text-primary text-sm">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate font-medium text-foreground text-sm">
            {user.fullName}
          </p>
          <p className="truncate text-muted-foreground text-xs">
            {displayRole}
          </p>
        </div>
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close profile menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 bottom-full left-0 z-50 mb-2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="border-border border-b px-4 py-4">
              <div className="flex items-start gap-3">
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className="bg-primary/15 font-medium text-primary text-sm">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {user.fullName}
                  </p>
                  <p className="truncate text-muted-foreground text-xs">
                    {user.email}
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
                    {displayRole}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-1">
              <ProfileMenuItem icon={User} label="Profile & account" />
              <ProfileMenuItem icon={Bell} label="Notifications" />
              <ProfileMenuItem icon={CircleHelp} label="Help & support" />
            </div>

            {isSuperAdmin ? (
              <div className="border-border border-t py-1">
                <p className="px-4 pt-2 pb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Switch workspace
                </p>
                {WORKSPACE_LIST.map((workspace) => {
                  const Icon = workspace.picker.icon
                  const active = workspace.id === roleId
                  return (
                    <Link
                      key={workspace.id}
                      to="/workspace/$role"
                      params={{ role: workspace.id }}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2 text-left text-foreground text-sm transition-colors hover:bg-muted/50",
                        active && "bg-muted/40 font-medium"
                      )}
                      onClick={() => {
                        setOpen(false)
                        onNavigate?.()
                      }}
                    >
                      <Icon
                        className="size-4 text-muted-foreground"
                        aria-hidden
                      />
                      <span className="flex-1">{workspace.name}</span>
                      {active ? (
                        <Check className="size-4 text-primary" aria-hidden />
                      ) : null}
                    </Link>
                  )
                })}
              </div>
            ) : null}

            <div className="border-border border-t py-1">
              {isSuperAdmin ? (
                <div className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <Moon
                      className="size-4 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="text-foreground text-sm">Dark mode</span>
                  </div>
                  {mounted ? (
                    <Switch
                      checked={isDark}
                      onCheckedChange={(checked) =>
                        setTheme(checked ? "dark" : "light")
                      }
                      aria-label="Toggle dark mode"
                    />
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="border-border border-t py-1">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-destructive text-sm transition-colors hover:bg-destructive/5"
                onClick={() => {
                  setOpen(false)
                  setSignOutOpen(true)
                }}
              >
                <LogOut className="size-4" aria-hidden />
                Sign out
              </button>
            </div>
          </div>
        </>
      ) : null}

      <SignOutDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        userName={user.fullName}
        onConfirm={() => void signOut()}
      />
    </div>
  )
}

function ProfileMenuItem({
  icon: Icon,
  label,
}: {
  icon: typeof User
  label: string
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2.5 text-left text-foreground text-sm transition-colors hover:bg-muted/50"
      )}
    >
      <Icon className="size-4 text-muted-foreground" aria-hidden />
      {label}
    </button>
  )
}
