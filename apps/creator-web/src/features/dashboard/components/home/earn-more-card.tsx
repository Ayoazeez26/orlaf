import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ExternalLink } from "lucide-react"
import type { DashboardEarnMoreCard } from "../../types"

interface EarnMoreCardProps {
  card: DashboardEarnMoreCard
}

export function EarnMoreCard({ card }: EarnMoreCardProps) {
  const Icon = card.icon

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-3 pt-6">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            card.iconBackgroundClassName
          )}
        >
          <Icon className={cn("size-5", card.iconClassName)} aria-hidden />
        </div>
        <div className="flex-1 space-y-1">
          <p className="font-semibold text-foreground text-sm">{card.title}</p>
          <p className="text-muted-foreground text-sm">{card.description}</p>
        </div>
        <Button
          type="button"
          variant="link"
          className="h-auto justify-start gap-1 p-0 font-medium text-primary"
        >
          Set up
          <ExternalLink className="size-3.5" aria-hidden />
        </Button>
      </CardContent>
    </Card>
  )
}
