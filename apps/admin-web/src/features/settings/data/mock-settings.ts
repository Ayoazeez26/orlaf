export interface TeamMember {
  id: string
  firstName: string
  lastName: string
  email: string
  initials: string
  role: string
}

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "ada-obi",
    firstName: "Ada",
    lastName: "Obi",
    email: "ada@sable.tv",
    initials: "AO",
    role: "super-admin",
  },
  {
    id: "tunde-bello",
    firstName: "Tunde",
    lastName: "Bello",
    email: "tunde@sable.tv",
    initials: "TB",
    role: "admin",
  },
  {
    id: "kemi-adeyemi",
    firstName: "Kemi",
    lastName: "Adeyemi",
    email: "kemi@sable.tv",
    initials: "KA",
    role: "moderator",
  },
  {
    id: "ifeoma-eze",
    firstName: "Ifeoma",
    lastName: "Eze",
    email: "ifeoma@sable.tv",
    initials: "IE",
    role: "analyst",
  },
]

export const DEFAULT_APPLICATION_QUESTIONS = `What kind of series will you make?
Link to a sample of your work.
How did you hear about Sable TV?`

export const DEFAULT_COMMUNITY_GUIDELINES =
  "No hate speech. No graphic violence. Respect copyright. Be honest with your audience."
