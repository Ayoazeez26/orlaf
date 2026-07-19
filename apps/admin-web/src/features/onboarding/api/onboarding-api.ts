import type {
  AdminApplicationDetail,
  AdminApplicationFilter,
  AdminApplicationListResponse,
  AdminInviteFilter,
  AdminInviteListItem,
  AdminInviteListResponse,
  CreateCreatorInviteRequest,
  RejectApplicationRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

interface ListParams {
  filter?: string
  q?: string
  page?: number
  pageSize?: number
}

function buildQuery(params: ListParams): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "" || value === "all") continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

// Applications ----------------------------------------------------------------

export function listApplications(
  params: ListParams & { filter?: AdminApplicationFilter }
): Promise<AdminApplicationListResponse> {
  return apiRequest<AdminApplicationListResponse>(
    `/api/v1/admin/onboarding/applications${buildQuery(params)}`
  )
}

export function getApplication(id: string): Promise<AdminApplicationDetail> {
  return apiRequest<AdminApplicationDetail>(
    `/api/v1/admin/onboarding/applications/${encodeURIComponent(id)}`
  )
}

export function approveApplication(
  id: string
): Promise<AdminApplicationDetail> {
  return apiRequest<AdminApplicationDetail>(
    `/api/v1/admin/onboarding/applications/${encodeURIComponent(id)}/approve`,
    { method: "POST" }
  )
}

export function rejectApplication(
  id: string,
  body: RejectApplicationRequest = {}
): Promise<AdminApplicationDetail> {
  return apiRequest<AdminApplicationDetail>(
    `/api/v1/admin/onboarding/applications/${encodeURIComponent(id)}/reject`,
    { method: "POST", body: JSON.stringify(body) }
  )
}

export function reopenApplication(id: string): Promise<AdminApplicationDetail> {
  return apiRequest<AdminApplicationDetail>(
    `/api/v1/admin/onboarding/applications/${encodeURIComponent(id)}/reopen`,
    { method: "POST" }
  )
}

// Invites ---------------------------------------------------------------------

export function listInvites(
  params: ListParams & { filter?: AdminInviteFilter }
): Promise<AdminInviteListResponse> {
  return apiRequest<AdminInviteListResponse>(
    `/api/v1/admin/onboarding/invites${buildQuery(params)}`
  )
}

export function createInvite(
  body: CreateCreatorInviteRequest
): Promise<AdminInviteListItem> {
  return apiRequest<AdminInviteListItem>(`/api/v1/admin/onboarding/invites`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function resendInvite(id: string): Promise<AdminInviteListItem> {
  return apiRequest<AdminInviteListItem>(
    `/api/v1/admin/onboarding/invites/${encodeURIComponent(id)}/resend`,
    { method: "POST" }
  )
}

export function revokeInvite(id: string): Promise<AdminInviteListItem> {
  return apiRequest<AdminInviteListItem>(
    `/api/v1/admin/onboarding/invites/${encodeURIComponent(id)}/revoke`,
    { method: "POST" }
  )
}
