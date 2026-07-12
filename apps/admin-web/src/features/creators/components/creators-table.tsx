import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import {
  formatCreatorEarnings,
  formatCreatorViews,
} from "../data/creator-details"
import type { Creator } from "../types"
import { CreatorStatusBadge } from "./creator-badges"

interface CreatorsTableProps {
  creators: Creator[]
  role: WorkspaceRoleId
}

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

export function CreatorsTable({ creators, role }: CreatorsTableProps) {
  if (creators.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No creators match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={HEAD_CLASS}>Creator</th>
            <th className={HEAD_CLASS}>Username</th>
            <th className={HEAD_CLASS}>Location</th>
            <th className={HEAD_CLASS}>Views</th>
            <th className={HEAD_CLASS}>Earnings</th>
            <th className={HEAD_CLASS}>Status</th>
            <th className={HEAD_CLASS}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {creators.map((creator) => (
            <tr
              key={creator.id}
              className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 shrink-0">
                    <AvatarFallback className="bg-primary/15 font-medium text-primary text-xs">
                      {creator.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {creator.name}
                    </p>
                    <p className="truncate text-muted-foreground text-xs">
                      {creator.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {creator.username}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {creator.location}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                {formatCreatorViews(creator.views)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground tabular-nums">
                {formatCreatorEarnings(creator.earnings)}
              </td>
              <td className="px-4 py-3">
                <CreatorStatusBadge status={creator.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Button asChild variant="outline" size="sm">
                  <Link
                    to="/workspace/$role/creators/$creatorId"
                    params={{ role, creatorId: creator.id }}
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
