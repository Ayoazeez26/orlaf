import type {
  AdminRole,
  AdminTeamResponse,
  CreateAdminStaffInviteRequest,
  UpdateAdminTeamMemberRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function getAdminTeam(): Promise<AdminTeamResponse> {
  return apiRequest<AdminTeamResponse>("/api/v1/admin/team")
}

export function inviteAdminMember(
  body: CreateAdminStaffInviteRequest
): Promise<unknown> {
  return apiRequest("/api/v1/admin/team/invites", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function resendAdminInvite(id: string): Promise<void> {
  return apiRequest<void>(
    `/api/v1/admin/team/invites/${encodeURIComponent(id)}/resend`,
    { method: "POST" }
  )
}

export function revokeAdminInvite(id: string): Promise<void> {
  return apiRequest<void>(
    `/api/v1/admin/team/invites/${encodeURIComponent(id)}/revoke`,
    { method: "POST" }
  )
}

export function updateAdminMember(
  id: string,
  body: UpdateAdminTeamMemberRequest
): Promise<unknown> {
  return apiRequest(`/api/v1/admin/team/members/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export type { AdminRole }
