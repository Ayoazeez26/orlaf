import type {
  CreateHelpArticleRequest,
  HelpArticle,
  HelpArticleListResponse,
  UpdateHelpArticleRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function listHelpArticles(): Promise<HelpArticleListResponse> {
  return apiRequest<HelpArticleListResponse>("/api/v1/admin/help-articles")
}

export function getHelpArticle(id: string): Promise<HelpArticle> {
  return apiRequest<HelpArticle>(
    `/api/v1/admin/help-articles/${encodeURIComponent(id)}`
  )
}

export function createHelpArticle(
  body: CreateHelpArticleRequest
): Promise<HelpArticle> {
  return apiRequest<HelpArticle>("/api/v1/admin/help-articles", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function updateHelpArticle(
  id: string,
  body: UpdateHelpArticleRequest
): Promise<HelpArticle> {
  return apiRequest<HelpArticle>(
    `/api/v1/admin/help-articles/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify(body) }
  )
}

export function deleteHelpArticle(id: string): Promise<void> {
  return apiRequest<void>(
    `/api/v1/admin/help-articles/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  )
}
