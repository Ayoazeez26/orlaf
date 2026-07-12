import { Button } from "@workspace/ui/components/button"
import { Coins, Pencil, Star, Trash2 } from "lucide-react"
import type { CoinBundle } from "../types"
import { BundleStatusBadge } from "./coin-badges"

interface BundlesTableProps {
  bundles: CoinBundle[]
  onEdit: (bundle: CoinBundle) => void
  onDelete: (bundle: CoinBundle) => void
}

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

function formatCoins(value: number) {
  return value.toLocaleString("en-US")
}

function formatBonus(bonusCoins: number) {
  if (bonusCoins === 0) return "No bonus"
  return `+${formatCoins(bonusCoins)}`
}

export function BundlesTable({ bundles, onEdit, onDelete }: BundlesTableProps) {
  if (bundles.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No coin bundles yet. Create one to get started.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={HEAD_CLASS}>Pack</th>
            <th className={HEAD_CLASS}>Coins</th>
            <th className={HEAD_CLASS}>Bonus</th>
            <th className={HEAD_CLASS}>Price</th>
            <th className={HEAD_CLASS}>Effective rate</th>
            <th className={HEAD_CLASS}>Status</th>
            <th className={HEAD_CLASS}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {bundles.map((bundle) => (
            <tr
              key={bundle.id}
              className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {bundle.name}
                  </span>
                  {bundle.isBestValue ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
                      <Star className="size-3" aria-hidden />
                      Best
                    </span>
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Coins className="size-4 text-primary" aria-hidden />
                  {formatCoins(bundle.coins)}
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatBonus(bundle.bonusCoins)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                {bundle.price}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {bundle.effectiveRate} / $
              </td>
              <td className="px-4 py-3">
                <BundleStatusBadge status={bundle.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${bundle.name}`}
                    onClick={() => onEdit(bundle)}
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${bundle.name}`}
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(bundle)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
