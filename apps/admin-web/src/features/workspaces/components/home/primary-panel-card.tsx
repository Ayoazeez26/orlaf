import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "../../lib/frosted-card"
import type { PrimaryPanel } from "../../types"
import { PanelHeader } from "./panel-header"
import { PanelItemRow } from "./panel-item-row"
import { ProgressRows } from "./progress-rows"

interface PrimaryPanelCardProps {
  panel: PrimaryPanel
}

export function PrimaryPanelCard({ panel }: PrimaryPanelCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="flex flex-col gap-5 p-0 px-6">
        <PanelHeader title={panel.title} actionLabel={panel.actionLabel} />

        {panel.progress ? <ProgressRows rows={panel.progress} /> : null}

        <ul className="flex flex-col gap-3">
          {panel.items.map((item) => (
            <PanelItemRow key={item.id} item={item} />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
