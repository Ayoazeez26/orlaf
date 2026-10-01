import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Loader2, Shield } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { parseGuidelinesContent } from "@/lib/parse-guidelines-content"
import { useGuidelinesQuery } from "../api/guidelines-hooks"

interface GuidelinesPanelProps {
  onReport: () => void
}

export function GuidelinesPanel({ onReport }: GuidelinesPanelProps) {
  const { data, isLoading } = useGuidelinesQuery()
  const blocks = data ? parseGuidelinesContent(data.content) : []

  return (
    <div className="space-y-4">
      <div
        className={cn(
          FROSTED_CARD_SURFACE_CLASS,
          "flex items-center gap-3 p-5"
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-primary/10">
          <Shield className="size-5 text-primary" aria-hidden />
        </span>
        <div>
          <p className="font-semibold text-foreground">Community guidelines</p>
          <p className="text-muted-foreground text-sm">
            {data
              ? `Last updated ${new Date(data.updatedAt).toLocaleDateString()}`
              : "Loading…"}
          </p>
        </div>
      </div>

      <div className={cn(FROSTED_CARD_SURFACE_CLASS, "space-y-4 p-6")}>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading guidelines…
          </div>
        ) : (
          blocks.map((block) =>
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
                className="text-muted-foreground text-sm leading-6"
              >
                {block.text}
              </p>
            )
          )
        )}
      </div>

      <div
        className={cn(
          FROSTED_CARD_SURFACE_CLASS,
          "flex flex-wrap items-center justify-between gap-4 px-5 py-5"
        )}
      >
        <div>
          <p className="font-semibold text-foreground">
            See something that breaks the rules?
          </p>
          <p className="text-muted-foreground text-sm">
            Report it and our trust team will review within 24 hours.
          </p>
        </div>
        <Button type="button" onClick={onReport}>
          Report content
        </Button>
      </div>
    </div>
  )
}
