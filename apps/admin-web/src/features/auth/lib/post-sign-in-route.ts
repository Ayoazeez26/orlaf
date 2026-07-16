import {
  adminRoleToWorkspaceId,
  type AdminSessionResponse,
} from "@sable/contracts"

export type PostSignInDestination = {
  to: "/change-password" | "/workspace/$role"
  params?: { role: string }
}

export function resolvePostSignInRoute(
  session: AdminSessionResponse
): PostSignInDestination {
  if (session.must_change_password) {
    return { to: "/change-password" }
  }

  return {
    to: "/workspace/$role",
    params: { role: adminRoleToWorkspaceId(session.role) },
  }
}
