import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Plus } from "lucide-react"
import { useState } from "react"
import { PROMOTION_TIME_RANGES } from "../constants"

interface PromotionsPageHeaderProps {
  onNewCampaign?: () => void
}

export function PromotionsPageHeader({
  onNewCampaign,
}: PromotionsPageHeaderProps) {
  const [timeRange, setTimeRange] = useState<string>("Last 30 days")

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Promotions
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Review and moderate platform content.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROMOTION_TIME_RANGES.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" className="gap-2" onClick={onNewCampaign}>
          <Plus className="size-4" aria-hidden />
          New campaign
        </Button>
      </div>
    </div>
  )
}
