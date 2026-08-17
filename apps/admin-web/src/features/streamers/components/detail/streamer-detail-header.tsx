import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowLeft, Ban, RotateCcw } from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import {
  useReactivateStreamer,
  useSuspendStreamer,
} from "../../api/streamers-hooks"
import type { StreamerDetail } from "../../types"
import { PlanBadge, StatusBadge } from "../streamer-badges"
import { StreamerSuspendDialog } from "./streamer-suspend-dialog"

interface StreamerDetailHeaderProps {
  streamer: StreamerDetail
  role: WorkspaceRoleId
}

export function StreamerDetailHeader({
  streamer,
  role,
}: StreamerDetailHeaderProps) {
  const [suspendOpen, setSuspendOpen] = useState(false)
  const isActive = streamer.status === "active"
  const suspend = useSuspendStreamer(streamer.id)
  const reactivate = useReactivateStreamer(streamer.id)
  const isBusy = suspend.isPending || reactivate.isPending

  return (
    <div className="space-y-4">
      <Link
        to="/workspace/$role/streamers"
        params={{ role }}
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Users
      </Link>

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-5")}>
        <CardContent className="flex flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 shrink-0">
              <AvatarFallback className="bg-primary/15 font-semibold text-lg text-primary">
                {streamer.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-semibold text-foreground text-xl tracking-tight">
                  {streamer.name}
                </h1>
                <StatusBadge status={streamer.status} />
                <PlanBadge plan={streamer.plan} />
                {streamer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="truncate text-muted-foreground text-sm">
                {streamer.email} · {streamer.username}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isActive ? (
              <Button
                type="button"
                className="gap-2 bg-destructive text-white hover:bg-destructive/90"
                disabled={isBusy}
                onClick={() => setSuspendOpen(true)}
              >
                <Ban className="size-4" aria-hidden />
                Suspend
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={isBusy}
                onClick={() => reactivate.mutate()}
              >
                <RotateCcw className="size-4" aria-hidden />
                Reactivate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <StreamerSuspendDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        streamerName={streamer.name}
        onConfirm={({ duration, reason }) =>
          suspend.mutate({ duration, reason: reason || undefined })
        }
      />
    </div>
  )
}
