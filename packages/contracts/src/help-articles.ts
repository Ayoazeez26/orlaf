export interface HelpArticleSummary {
  id: string
  slug: string
  title: string
  category: string
  isPublished: boolean
  updatedAt: string
}

export interface HelpArticle extends HelpArticleSummary {
  body: string
  relatedIds: string[]
}

export interface HelpArticleListResponse {
  items: HelpArticleSummary[]
}

export interface CreateHelpArticleRequest {
  title: string
  body: string
  category: string
  relatedIds?: string[]
  isPublished?: boolean
}

export interface UpdateHelpArticleRequest {
  title?: string
  body?: string
  category?: string
  relatedIds?: string[]
  isPublished?: boolean
}
