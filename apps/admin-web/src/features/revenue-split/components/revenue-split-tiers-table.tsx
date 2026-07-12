import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { RevenueSplitTier, RevenueSplitTierId } from "../types"

interface RevenueSplitTiersTableProps {
  tiers: RevenueSplitTier[]
  onChange: (id: RevenueSplitTierId, patch: Partial<RevenueSplitTier>) => void
}

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

type PercentField = "creatorPercent" | "platformPercent" | "affiliatePercent"

function PercentInput({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="relative max-w-[120px]">
      <Input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-9 pr-7 tabular-nums"
      />
      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-sm">
        %
      </span>
    </div>
  )
}

export function RevenueSplitTiersTable({
  tiers,
  onChange,
}: RevenueSplitTiersTableProps) {
  function updateField(
    id: RevenueSplitTierId,
    field: PercentField,
    value: number
  ) {
    onChange(id, { [field]: value })
  }

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground text-lg tracking-tight">
          Revenue Split
        </p>
        <p className="text-muted-foreground text-sm">
          Boosted splits for higher creator tiers.
        </p>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className={HEAD_CLASS}>Tier</th>
                <th className={HEAD_CLASS}>Creator %</th>
                <th className={HEAD_CLASS}>Platform %</th>
                <th className={HEAD_CLASS}>Affiliate %</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr
                  key={tier.id}
                  className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-4 font-medium text-foreground">
                    {tier.label}
                  </td>
                  <td className="px-4 py-4">
                    <PercentInput
                      value={tier.creatorPercent}
                      onChange={(value) =>
                        updateField(tier.id, "creatorPercent", value)
                      }
                    />
                  </td>
                  <td className="px-4 py-4">
                    <PercentInput
                      value={tier.platformPercent}
                      onChange={(value) =>
                        updateField(tier.id, "platformPercent", value)
                      }
                    />
                  </td>
                  <td className="px-4 py-4">
                    <PercentInput
                      value={tier.affiliatePercent}
                      onChange={(value) =>
                        updateField(tier.id, "affiliatePercent", value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
