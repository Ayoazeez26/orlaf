import { useQuery } from "@tanstack/react-query"
import { getHelpArticleBySlug, listHelpArticles } from "./help-articles-api"

export const helpArticlesKeys = {
  all: ["help-articles"] as const,
  detail: (slug: string) => ["help-articles", slug] as const,
}

export function useHelpArticlesQuery() {
  return useQuery({
    queryKey: helpArticlesKeys.all,
    queryFn: listHelpArticles,
  })
}

export function useHelpArticleQuery(slug: string | undefined) {
  return useQuery({
    queryKey: helpArticlesKeys.detail(slug ?? ""),
    queryFn: () => getHelpArticleBySlug(slug as string),
    enabled: slug !== undefined,
  })
}
