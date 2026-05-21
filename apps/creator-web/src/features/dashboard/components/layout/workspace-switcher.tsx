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
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  LogOut,
  Settings,
  User,
  UserPlus,
} from "lucide-react"
import { MOCK_WORKSPACES } from "../../constants"
import type { DashboardUser } from "../../types"

interface WorkspaceSwitcherProps {
  user: DashboardUser
  className?: string
}

export function WorkspaceSwitcher({ user, className }: WorkspaceSwitcherProps) {
  const { workspace } = user
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
            {workspace.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs">{user.role}</p>
          <p className="truncate font-semibold text-foreground text-sm">
            {workspace.name}
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
          {MOCK_WORKSPACES.map((ws) => (
            <DropdownMenuItem key={ws.id} className="gap-3 py-2.5">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {ws.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{ws.name}</p>
                <p className="text-muted-foreground text-xs">{ws.role}</p>
              </div>
              {ws.id === workspace.id && (
                <Check className="size-4 text-primary" aria-hidden />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Building2 className="size-4" aria-hidden />
          New Studio
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserPlus className="size-4" aria-hidden />
          Invite Team
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="size-4" aria-hidden />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="size-4" aria-hidden />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CircleHelp className="size-4" aria-hidden />
          Help &amp; Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut className="size-4" aria-hidden />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
