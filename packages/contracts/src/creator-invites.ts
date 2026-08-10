/**
 * @sable/contracts — creator invite validation (public)
 */

export type CreatorInviteStatus = "sent" | "accepted" | "expired" | "revoked"

export interface ValidateCreatorInviteResponse {
  valid: boolean
  status: CreatorInviteStatus
  email?: string
  firstName?: string | null
  lastName?: string | null
  note?: string | null
  message?: string
}
