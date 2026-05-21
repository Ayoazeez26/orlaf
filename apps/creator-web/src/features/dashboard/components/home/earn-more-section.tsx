import { Lightbulb } from "lucide-react"
import type { DashboardEarnMoreCard } from "../../types"
import { EarnMoreCard } from "./earn-more-card"

interface EarnMoreSectionProps {
  cards: DashboardEarnMoreCard[]
}

export function EarnMoreSection({ cards }: EarnMoreSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="size-5 text-muted-foreground" aria-hidden />
        <h2 className="font-semibold text-foreground text-sm">
          More ways to earn
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <EarnMoreCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}
