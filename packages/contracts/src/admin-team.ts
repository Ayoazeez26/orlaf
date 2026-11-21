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

/** Result of opening an admin invite link (public, by token). */
export interface AdminInviteDetails {
  email: string
  role: AdminRole
  /** `valid` means the invite can be accepted now. */
  status: "valid" | "expired" | "revoked" | "accepted"
  invitedByName: string
  expiresAt: string
}

export interface AcceptAdminInviteRequest {
  firstName: string
  lastName: string
  password: string
}
