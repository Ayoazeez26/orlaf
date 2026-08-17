export interface TeamMember {
  id: string
  firstName: string
  lastName: string
  email: string
  initials: string
  role: string
}

export const DEFAULT_APPLICATION_QUESTIONS = `What kind of series will you make?
Link to a sample of your work.
How did you hear about Sable TV?`

export const DEFAULT_COMMUNITY_GUIDELINES =
  "No hate speech. No graphic violence. Respect copyright. Be honest with your audience."
