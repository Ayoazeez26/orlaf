import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { Bell, CircleHelp, LogOut, Moon, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useAuth } from "@/features/auth/auth-context"
import type { WorkspaceRoleId, WorkspaceUser } from "../../types"
import { SignOutDialog } from "./sign-out-dialog"

interface SidebarUserProfileProps {
  user: WorkspaceUser
  roleName: string
  roleId: WorkspaceRoleId
}

export function SidebarUserProfile({
  user,
  roleName,
  roleId,
}: SidebarUserProfileProps) {
  const { signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isSuperAdmin = roleId === "super-admin"
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
          <p className="truncate text-muted-foreground text-xs">{roleName}</p>
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
                    {roleName}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-1">
              <ProfileMenuItem icon={User} label="Profile & account" />
              <ProfileMenuItem icon={Bell} label="Notifications" />
              <ProfileMenuItem icon={CircleHelp} label="Help & support" />
            </div>

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
