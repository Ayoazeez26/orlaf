import {
  type AdminSessionResponse,
  adminRoleToWorkspaceId,
} from "@sable/contracts"

export type PostSignInDestination = {
  to: "/change-password" | "/setup-2fa" | "/workspace/$role"
  params?: { role: string }
}

export function resolvePostSignInRoute(
  session: AdminSessionResponse
): PostSignInDestination {
  if (session.must_change_password) {
    return { to: "/change-password" }
  }

  if (session.must_setup_2fa) {
    return { to: "/setup-2fa" }
  }

  return {
    to: "/workspace/$role",
    params: { role: adminRoleToWorkspaceId(session.role) },
  }
}
