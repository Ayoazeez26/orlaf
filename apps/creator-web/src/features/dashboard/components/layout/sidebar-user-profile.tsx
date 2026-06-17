import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { ChevronUp } from "lucide-react"
import type { DashboardUser } from "../../types"

interface SidebarUserProfileProps {
  user: DashboardUser
}

export function SidebarUserProfile({ user }: SidebarUserProfileProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto w-full justify-start gap-3 rounded-xl px-2 py-3 hover:bg-muted/60"
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
        <p className="truncate text-muted-foreground text-xs">{user.role}</p>
      </div>
      <ChevronUp
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden
      />
    </Button>
  )
}
