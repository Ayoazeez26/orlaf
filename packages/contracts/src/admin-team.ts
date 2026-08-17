import type { AdminRole } from "./auth.js"

export interface AdminTeamMember {
  id: string
  firstName: string
  lastName: string
  email: string
  initials: string
  role: AdminRole
  status: string
}

export interface AdminStaffInvite {
  id: string
  email: string
  role: AdminRole
  status: "sent" | "accepted" | "expired" | "revoked"
  invitedByName: string
  createdAt: string
  expiresAt: string
}

export interface AdminTeamResponse {
  members: AdminTeamMember[]
  invites: AdminStaffInvite[]
}

export interface CreateAdminStaffInviteRequest {
  email: string
  role: AdminRole
  firstName?: string
  lastName?: string
}

export interface UpdateAdminTeamMemberRequest {
  role: AdminRole
}
