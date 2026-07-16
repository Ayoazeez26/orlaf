import { AdminRole, adminRoleToWorkspaceId } from "@sable/contracts"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useMemo } from "react"
import { useAuth } from "@/features/auth/auth-context"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { DashboardLayout } from "@/features/workspaces/components/layout/dashboard-layout"
import {
  adminSessionToWorkspaceUser,
} from "@/features/workspaces/data/shared"
import { getWorkspace, isWorkspaceRole } from "@/features/workspaces/data/roles"

export const Route = createFileRoute("/workspace/$role")({
  ssr: false,
  beforeLoad: async ({ params }) => {
    if (!isWorkspaceRole(params.role)) {
      throw redirect({ to: "/login" })
    }

    const { status, session } = await getAuthReady()

    if (status === "loading") return

    if (status !== "authenticated" || !session) {
      throw redirect({ to: "/login" })
    }

    if (session.must_change_password) {
      throw redirect({ to: "/change-password" })
    }

    const homeWorkspace = adminRoleToWorkspaceId(session.role)
    const isSuperAdmin = session.role === AdminRole.SUPER_ADMIN

    if (!isSuperAdmin && params.role !== homeWorkspace) {
      throw redirect({
        to: "/workspace/$role",
        params: { role: homeWorkspace },
      })
    }
  },
  component: WorkspaceLayout,
})

function WorkspaceLayout() {
  const { role } = Route.useParams()
  const { session } = useAuth()
  const baseConfig = getWorkspace(role)

  const config = useMemo(() => {
    if (!baseConfig || !session) return null
    return {
      ...baseConfig,
      user: adminSessionToWorkspaceUser(session.admin),
    }
  }, [baseConfig, session])

  if (!config) return null

  return <DashboardLayout config={config} />
}
