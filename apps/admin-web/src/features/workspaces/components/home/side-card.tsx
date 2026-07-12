import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "../../lib/frosted-card"
import type { SideCard as SideCardData } from "../../types"
import { PanelHeader } from "./panel-header"
import { PanelItemRow } from "./panel-item-row"
import { ProgressRows } from "./progress-rows"

interface SideCardProps {
  card: SideCardData
}

export function SideCard({ card }: SideCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="flex flex-col gap-4 p-0 px-6">
        <PanelHeader
          title={card.title}
          actionLabel={card.kind === "items" ? card.actionLabel : undefined}
        />

        {card.kind === "progress" ? <ProgressRows rows={card.rows} /> : null}

        {card.kind === "items" ? (
          <ul className="flex flex-col gap-3">
            {card.items.map((item) => (
              <PanelItemRow key={item.id} item={item} />
            ))}
          </ul>
        ) : null}

        {card.kind === "stats" ? (
          <ul className="flex flex-col gap-3">
            {card.rows.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-muted-foreground text-sm">
                  {row.label}
                </span>
                <span className="font-semibold text-foreground text-sm tabular-nums">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  )
}
