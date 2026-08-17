import { useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import {
  Check,
  ChevronDown,
  CircleHelp,
  LogOut,
  Settings,
  User,
  UserPlus,
} from "lucide-react"
import { useAuth } from "@/features/auth/auth-context"
import { useStudioMembershipsQuery } from "@/features/settings/api/team-hooks"
import { getActiveStudioId, setActiveStudioId } from "@/lib/studio-id"
import type { DashboardUser } from "../../types"

interface WorkspaceSwitcherProps {
  user: DashboardUser
  className?: string
}

export function WorkspaceSwitcher({ user, className }: WorkspaceSwitcherProps) {
  const { signOut } = useAuth()
  const queryClient = useQueryClient()
  const { data } = useStudioMembershipsQuery()
  const items = data?.items ?? []
  const stored = getActiveStudioId()
  const active =
    items.find((item) => item.studioOwnerId === stored) ?? items[0] ?? null

  const label = active?.name ?? user.fullName
  const initials = active?.initials ?? user.initials
  const role = active
    ? active.role.charAt(0).toUpperCase() + active.role.slice(1)
    : user.role

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs">{role}</p>
          <p className="truncate font-semibold text-foreground text-sm">
            {label}
          </p>
        </div>
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="font-normal text-muted-foreground text-xs">
          Switch workspace
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {items.map((ws) => (
            <DropdownMenuItem
              key={ws.studioOwnerId}
              className="gap-3 py-2.5"
              onClick={() => {
                setActiveStudioId(ws.studioOwnerId)
                void queryClient.invalidateQueries()
              }}
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {ws.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{ws.name}</p>
                <p className="text-muted-foreground text-xs">
                  {ws.role.charAt(0).toUpperCase() + ws.role.slice(1)}
                </p>
              </div>
              {ws.studioOwnerId === active?.studioOwnerId ? (
                <Check className="size-4 text-primary" aria-hidden />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard/settings/team">
            <UserPlus className="size-4" aria-hidden />
            Invite Team
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/settings">
            <User className="size-4" aria-hidden />
            View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/settings">
            <Settings className="size-4" aria-hidden />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/support">
            <CircleHelp className="size-4" aria-hidden />
            Help &amp; Support
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            void signOut()
          }}
        >
          <LogOut className="size-4" aria-hidden />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
