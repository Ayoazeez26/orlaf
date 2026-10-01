import type {
  CreateHelpArticleRequest,
  UpdateHelpArticleRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createHelpArticle,
  deleteHelpArticle,
  getHelpArticle,
  listHelpArticles,
  updateHelpArticle,
} from "./help-articles-api"

export const helpArticlesKeys = {
  all: ["admin", "help-articles"] as const,
  detail: (id: string) => ["admin", "help-articles", id] as const,
}

export function useHelpArticlesQuery() {
  return useQuery({
    queryKey: helpArticlesKeys.all,
    queryFn: listHelpArticles,
  })
}

export function useHelpArticleQuery(id: string | null) {
  return useQuery({
    queryKey: helpArticlesKeys.detail(id ?? ""),
    queryFn: () => getHelpArticle(id as string),
    enabled: id !== null,
  })
}

export function useCreateHelpArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateHelpArticleRequest) => createHelpArticle(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: helpArticlesKeys.all }),
  })
}

export function useUpdateHelpArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: UpdateHelpArticleRequest
    }) => updateHelpArticle(id, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: helpArticlesKeys.all }),
  })
}

export function useDeleteHelpArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteHelpArticle(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: helpArticlesKeys.all }),
  })
}
