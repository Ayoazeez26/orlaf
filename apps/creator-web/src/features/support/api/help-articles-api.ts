import type { HelpArticle, HelpArticleListResponse } from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function listHelpArticles(): Promise<HelpArticleListResponse> {
  return apiRequest<HelpArticleListResponse>("/api/v1/help-articles")
}

export function getHelpArticleBySlug(slug: string): Promise<HelpArticle> {
  return apiRequest<HelpArticle>(
    `/api/v1/help-articles/${encodeURIComponent(slug)}`
  )
}
