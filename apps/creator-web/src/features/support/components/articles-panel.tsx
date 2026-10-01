import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronRight, Loader2, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { useHelpArticlesQuery } from "../api/help-articles-hooks"

interface ArticlesPanelProps {
  onOpenArticle: (slug: string) => void
}

export function ArticlesPanel({ onOpenArticle }: ArticlesPanelProps) {
  const { data, isLoading } = useHelpArticlesQuery()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | string>("all")

  const items = data?.items ?? []

  const categories = useMemo(() => {
    const seen = new Set<string>()
    for (const article of items) seen.add(article.category)
    return Array.from(seen)
  }, [items])

  const articles = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((article) => {
      if (filter !== "all" && article.category !== filter) return false
      if (!q) return true
      return article.title.toLowerCase().includes(q)
    })
  }, [items, query, filter])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search help articles..."
          aria-label="Search help articles"
          className="h-11 rounded-full border-border bg-input-bg pr-4 pl-10 dark:bg-input-bg"
        />
      </div>

      {categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full px-3.5 py-1.5 font-medium text-sm transition-colors",
              filter === "all"
                ? "bg-foreground text-background"
                : "border border-border bg-card text-foreground hover:bg-muted"
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-medium text-sm capitalize transition-colors",
                filter === category
                  ? "bg-foreground text-background"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <div
        className={cn(
          FROSTED_CARD_SURFACE_CLASS,
          "divide-y divide-border overflow-hidden py-0"
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading articles…
          </div>
        ) : items.length === 0 ? (
          <div className="space-y-1 px-6 py-10 text-center">
            <p className="font-medium text-foreground text-sm">
              No help articles yet
            </p>
            <p className="text-muted-foreground text-sm">
              Check back soon — our team is putting together guides for you.
            </p>
          </div>
        ) : articles.length === 0 ? (
          <p className="p-6 text-muted-foreground text-sm">
            No articles match your search.
          </p>
        ) : (
          articles.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => onOpenArticle(article.slug)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
            >
              <span>
                <p className="font-semibold text-foreground text-sm">
                  {article.title}
                </p>
                <p className="mt-1 text-muted-foreground text-sm capitalize">
                  {article.category}
                </p>
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
