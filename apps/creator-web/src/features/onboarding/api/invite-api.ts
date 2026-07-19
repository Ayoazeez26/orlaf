import type { ValidateCreatorInviteResponse } from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export async function validateCreatorInvite(
  token: string
): Promise<ValidateCreatorInviteResponse> {
  return apiRequest<ValidateCreatorInviteResponse>(
    `/api/v1/creators/invites/${encodeURIComponent(token)}`,
    { method: "GET" }
  )
}
