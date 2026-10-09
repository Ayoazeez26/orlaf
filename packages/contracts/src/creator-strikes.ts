export interface IssueCreatorStrikeRequest {
  reason: string
}

export interface CreatorStrike {
  id: string
  reason: string
  issuedByName: string | null
  createdAt: string
}

export interface IssueCreatorStrikeResponse {
  strikeCount: number
  strikesBeforeSuspension: number
  autoSuspended: boolean
}
