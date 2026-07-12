import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ProgressRows } from "@/features/workspaces/components/home/progress-rows"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { SpendCategory } from "../../types"

interface TopSpendCategoriesCardProps {
  categories: SpendCategory[]
  className?: string
}

export function TopSpendCategoriesCard({
  categories,
  className,
}: TopSpendCategoriesCardProps) {
  const rows = categories.map((category) => ({
    label: category.label,
    value: `${category.percent}%`,
    percent: category.percent,
    tone: "primary" as const,
  }))

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground text-lg tracking-tight">
          Top spend categories
        </p>
        <p className="text-muted-foreground text-sm">
          Share of coins spent this month
        </p>
      </CardHeader>
      <CardContent>
        <ProgressRows rows={rows} />
      </CardContent>
    </Card>
  )
}
