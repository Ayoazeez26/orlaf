import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  Ticket,
} from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import {
  getHelpArticle,
  HELP_ARTICLE_CATEGORY_LABEL,
} from "../data/help-articles"

interface ArticleDetailProps {
  articleId: string
  onBack: () => void
  onOpenArticle: (id: string) => void
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
  const article = getHelpArticle(articleId)
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null)

  if (!article) {
    return (
      <div className="space-y-4">
        <BackLink onClick={onBack} />
        <p className="text-muted-foreground text-sm">Article not found.</p>
      </div>
    )
  }

  const related = article.relatedIds
    .map((id) => getHelpArticle(id))
    .filter((item) => item != null)

  return (
    <div className="space-y-5">
      <BackLink onClick={onBack} />

      <div className={cn(FROSTED_CARD_SURFACE_CLASS, "space-y-5 p-6")}>
        <div className="space-y-2">
          <p className="font-medium text-primary text-sm">
            {HELP_ARTICLE_CATEGORY_LABEL[article.category]}
          </p>
          <h2 className="font-semibold text-2xl tracking-tight">
            {article.title}
          </h2>
          <p className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Clock className="size-3.5" aria-hidden />
            {article.minutes} min read · Updated {article.updated}
          </p>
        </div>

        {article.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-foreground text-sm leading-6">
            {paragraph}
          </p>
        ))}

        {article.steps ? (
          <ol className="space-y-4">
            {article.steps.map((step, index) => (
              <li key={step.title} className="text-sm leading-6">
                <p className="font-semibold text-foreground">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1 text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        ) : null}
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
                onClick={() => onOpenArticle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
              >
                <span>
                  <p className="font-semibold text-foreground text-sm">
                    {item.title}
                  </p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {HELP_ARTICLE_CATEGORY_LABEL[item.category]} ·{" "}
                    {item.minutes} min read
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
