import { AdminRole } from "@sable/contracts"
import { Link } from "@tanstack/react-router"
import { Eye } from "lucide-react"
import { useAuth } from "@/features/auth/auth-context"
import type { WorkspaceConfig } from "../../types"

/**
 * Shown when a super admin is looking at another role's workspace, so it's
 * clear the view is scoped to that role and how to get back.
 */
export function WorkspaceViewBanner({ config }: { config: WorkspaceConfig }) {
  const { session } = useAuth()

  if (session?.role !== AdminRole.SUPER_ADMIN || config.id === "super-admin") {
    return null
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-border border-b bg-primary/5 px-4 py-2 text-sm">
      <p className="flex min-w-0 items-center gap-2 text-foreground">
        <Eye className="size-4 shrink-0 text-primary" aria-hidden />
        <span className="min-w-0">
          Viewing the <strong className="font-medium">{config.name}</strong>{" "}
          workspace
        </span>
      </p>
      <Link
        to="/workspace/$role"
        params={{ role: "super-admin" }}
        className="font-medium text-primary hover:underline"
      >
        Back to Super Admin
      </Link>
    </div>
  )
}
