import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  Ticket,
} from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { parseGuidelinesContent } from "@/lib/parse-guidelines-content"
import {
  useHelpArticleQuery,
  useHelpArticlesQuery,
} from "../api/help-articles-hooks"

interface ArticleDetailProps {
  articleId: string
  onBack: () => void
  onOpenArticle: (slug: string) => void
  onOpenChat: () => void
  onOpenTicket: () => void
}

export function ArticleDetail({
  articleId,
  onBack,
  onOpenArticle,
  onOpenChat,
  onOpenTicket,
}: ArticleDetailProps) {
  const { data: article, isLoading, isError } = useHelpArticleQuery(articleId)
  const { data: allArticles } = useHelpArticlesQuery()
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <BackLink onClick={onBack} />
        <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading article…
        </div>
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="space-y-4">
        <BackLink onClick={onBack} />
        <p className="text-muted-foreground text-sm">Article not found.</p>
      </div>
    )
  }

  const blocks = parseGuidelinesContent(article.body)
  const related = article.relatedIds
    .map((id) => allArticles?.items.find((item) => item.id === id))
    .filter((item) => item != null)

  return (
    <div className="space-y-5">
      <BackLink onClick={onBack} />

      <div className={cn(FROSTED_CARD_SURFACE_CLASS, "space-y-5 p-6")}>
        <div className="space-y-2">
          <p className="font-medium text-primary text-sm capitalize">
            {article.category}
          </p>
          <h2 className="font-semibold text-2xl tracking-tight">
            {article.title}
          </h2>
          <p className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Clock className="size-3.5" aria-hidden />
            Updated {new Date(article.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {blocks.map((block) =>
          block.type === "heading" ? (
            <p
              key={`h-${block.text}`}
              className="pt-2 font-semibold text-foreground text-sm first:pt-0"
            >
              {block.text}
            </p>
          ) : (
            <p
              key={`p-${block.text}`}
              className="text-foreground text-sm leading-6"
            >
              {block.text}
            </p>
          )
        )}
      </div>

      <div
        className={cn(
          FROSTED_CARD_SURFACE_CLASS,
          "flex flex-wrap items-center justify-between gap-3 px-5 py-4"
        )}
      >
        <p className="font-medium text-foreground text-sm">
          Was this article helpful?
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "gap-1.5",
              helpful === "yes" &&
                "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            )}
            onClick={() => setHelpful("yes")}
          >
            <ThumbsUp className="size-3.5" aria-hidden />
            Yes
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "gap-1.5",
              helpful === "no" &&
                "border-destructive/40 bg-destructive/10 text-destructive"
            )}
            onClick={() => setHelpful("no")}
          >
            <ThumbsDown className="size-3.5" aria-hidden />
            No
          </Button>
        </div>
      </div>

      <div
        className={cn(
          FROSTED_CARD_SURFACE_CLASS,
          "flex flex-wrap items-center justify-between gap-4 px-5 py-5"
        )}
      >
        <div>
          <p className="font-semibold text-foreground">Still need help?</p>
          <p className="text-muted-foreground text-sm">
            Reach a human in under 2 minutes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="gap-2" onClick={onOpenChat}>
            <MessageCircle className="size-4" aria-hidden />
            Start live chat
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={onOpenTicket}
          >
            <Ticket className="size-4" aria-hidden />
            Open a ticket
          </Button>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="space-y-3">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Related articles
          </p>
          <div
            className={cn(
              FROSTED_CARD_SURFACE_CLASS,
              "divide-y divide-border overflow-hidden py-0"
            )}
          >
            {related.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenArticle(item.slug)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
              >
                <span>
                  <p className="font-semibold text-foreground text-sm">
                    {item.title}
                  </p>
                  <p className="mt-1 text-muted-foreground text-sm capitalize">
                    {item.category}
                  </p>
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
    >
      <ChevronLeft className="size-4" aria-hidden />
      Back to articles
    </button>
  )
}
