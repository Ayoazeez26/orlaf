export type ApplicationStatus = "pending" | "approved" | "rejected"

export type InviteStatus = "sent" | "accepted" | "expired" | "rejected"

export interface OnboardingApplication {
  id: string
  name: string
  email: string
  username: string
  initials: string
  location: string
  source: string
  submitted: string
  status: ApplicationStatus
}

export interface OnboardingInvite {
  id: string
  email: string
  status: InviteStatus
  sentBy: string
  sent: string
}

export interface ChecklistStep {
  id: string
  label: string
  completed: boolean
}

export interface ApplicationDetail extends OnboardingApplication {
  bio: string
  checklist: ChecklistStep[]
}
