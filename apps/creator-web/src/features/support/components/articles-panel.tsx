import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronRight, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import {
  HELP_ARTICLE_CATEGORY_LABEL,
  HELP_ARTICLES,
} from "../data/help-articles"
import type { HelpArticleCategory } from "../types"

const FILTERS: { id: "all" | HelpArticleCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "getting-started", label: "Getting started" },
  { id: "monetization", label: "Monetization" },
  { id: "promotions", label: "Promotions" },
  { id: "account", label: "Account" },
]

interface ArticlesPanelProps {
  onOpenArticle: (id: string) => void
}

export function ArticlesPanel({ onOpenArticle }: ArticlesPanelProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all")

  const articles = useMemo(() => {
    const q = query.trim().toLowerCase()
    return HELP_ARTICLES.filter((article) => {
      if (filter !== "all" && article.category !== filter) return false
      if (!q) return true
      return article.title.toLowerCase().includes(q)
    })
  }, [query, filter])

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

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const isActive = item.id === filter
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-medium text-sm transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div
        className={cn(
          FROSTED_CARD_SURFACE_CLASS,
          "divide-y divide-border overflow-hidden py-0"
        )}
      >
        {articles.length === 0 ? (
          <p className="p-6 text-muted-foreground text-sm">
            No articles match your search.
          </p>
        ) : (
          articles.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => onOpenArticle(article.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
            >
              <span>
                <p className="font-semibold text-foreground text-sm">
                  {article.title}
                </p>
                <p className="mt-1 text-muted-foreground text-sm">
                  {HELP_ARTICLE_CATEGORY_LABEL[article.category]} ·{" "}
                  {article.minutes} min read
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
