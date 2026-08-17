import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Shield } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { GUIDELINE_RULES } from "../data/help-articles"

interface GuidelinesPanelProps {
  onReport: () => void
}

export function GuidelinesPanel({ onReport }: GuidelinesPanelProps) {
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
            Last updated May 12, 2026
          </p>
        </div>
      </div>

      <div className={cn(FROSTED_CARD_SURFACE_CLASS, "space-y-5 p-6")}>
        {GUIDELINE_RULES.map((rule) => (
          <div key={rule.n} className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
              {rule.n}
            </span>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {rule.title}
              </p>
              <p className="mt-1 text-muted-foreground text-sm leading-6">
                {rule.body}
              </p>
            </div>
          </div>
        ))}
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
