import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"

interface CoinEconomyPageHeaderProps {
  onNewBundle: () => void
}

export function CoinEconomyPageHeader({
  onNewBundle,
}: CoinEconomyPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Coin economy
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          In-app currency, bundles, earn & spend rules, and creator coin
          payouts.
        </p>
      </div>
      <Button type="button" className="shrink-0 gap-2" onClick={onNewBundle}>
        <Plus className="size-4" aria-hidden />
        New Bundle
      </Button>
    </div>
  )
}
