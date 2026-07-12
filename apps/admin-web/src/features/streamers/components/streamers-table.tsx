import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { Streamer } from "../types"
import { PlanBadge, StatusBadge } from "./streamer-badges"

interface StreamersTableProps {
  streamers: Streamer[]
  role: WorkspaceRoleId
}

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

export function StreamersTable({ streamers, role }: StreamersTableProps) {
  if (streamers.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No streamers match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={HEAD_CLASS}>User</th>
            <th className={HEAD_CLASS}>Username</th>
            <th className={HEAD_CLASS}>Plan</th>
            <th className={HEAD_CLASS}>Location</th>
            <th className={HEAD_CLASS}>Watch Hours</th>
            <th className={HEAD_CLASS}>Lifetime Spend</th>
            <th className={HEAD_CLASS}>Status</th>
            <th className={HEAD_CLASS}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {streamers.map((streamer) => (
            <tr
              key={streamer.id}
              className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 shrink-0">
                    <AvatarFallback className="bg-primary/15 font-medium text-primary text-xs">
                      {streamer.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {streamer.name}
                    </p>
                    <p className="truncate text-muted-foreground text-xs">
                      {streamer.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {streamer.username}
              </td>
              <td className="px-4 py-3">
                <PlanBadge plan={streamer.plan} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {streamer.location}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                {streamer.watchHours} h
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground tabular-nums">
                ${streamer.lifetimeSpend.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={streamer.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Button asChild variant="outline" size="sm">
                  <Link
                    to="/workspace/$role/streamers/$streamerId"
                    params={{ role, streamerId: streamer.id }}
                  >
                    View
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
