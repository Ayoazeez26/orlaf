/**
 * @sable/contracts — studio team + workspace memberships
 */

export type StudioTeamRole = "owner" | "admin" | "editor" | "viewer"

export interface StudioTeamMember {
  id: string
  accountId: string
  name: string
  email: string
  initials: string
  role: StudioTeamRole
}

export interface StudioTeamInvite {
  id: string
  email: string
  role: Exclude<StudioTeamRole, "owner">
  status: "sent" | "accepted" | "expired" | "revoked"
  createdAt: string
  expiresAt: string
}

export interface StudioTeamResponse {
  studioOwnerId: string
  studioName: string
  canManage: boolean
  members: StudioTeamMember[]
  invites: StudioTeamInvite[]
}

export interface CreateStudioInviteRequest {
  email: string
  role: Exclude<StudioTeamRole, "owner">
}

export interface StudioMembership {
  studioOwnerId: string
  name: string
  initials: string
  role: StudioTeamRole
}

export interface StudioMembershipsResponse {
  items: StudioMembership[]
}
