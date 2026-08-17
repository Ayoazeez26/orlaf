export type SupportTab = "articles" | "ticket" | "chat" | "guidelines"

export type HelpArticleCategory =
  | "getting-started"
  | "monetization"
  | "promotions"
  | "account"

export interface HelpArticle {
  id: string
  title: string
  category: HelpArticleCategory
  minutes: number
  updated: string
  paragraphs: string[]
  steps?: { title: string; body: string }[]
  relatedIds: string[]
}

export type TicketTopic =
  | "payouts"
  | "promotions"
  | "uploads"
  | "account"
  | "other"

export type TicketPriorityChoice = "normal" | "high" | "urgent"
