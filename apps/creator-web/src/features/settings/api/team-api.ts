import type {
  CreateStudioInviteRequest,
  StudioMembershipsResponse,
  StudioTeamInvite,
  StudioTeamResponse,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function getStudioMemberships(): Promise<StudioMembershipsResponse> {
  return apiRequest("/api/v1/studio/memberships")
}

export function getStudioTeam(): Promise<StudioTeamResponse> {
  return apiRequest("/api/v1/studio/team")
}

export function inviteStudioMember(
  body: CreateStudioInviteRequest
): Promise<StudioTeamInvite> {
  return apiRequest("/api/v1/studio/team/invites", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function resendStudioInvite(id: string): Promise<void> {
  return apiRequest(
    `/api/v1/studio/team/invites/${encodeURIComponent(id)}/resend`,
    {
      method: "POST",
    }
  )
}

export function revokeStudioInvite(id: string): Promise<void> {
  return apiRequest(
    `/api/v1/studio/team/invites/${encodeURIComponent(id)}/revoke`,
    {
      method: "POST",
    }
  )
}

export function removeStudioMember(id: string): Promise<void> {
  return apiRequest(`/api/v1/studio/team/members/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}

export function acceptStudioInvite(token: string): Promise<StudioTeamResponse> {
  return apiRequest(
    `/api/v1/studio/team/invites/${encodeURIComponent(token)}/accept`,
    { method: "POST" }
  )
}
