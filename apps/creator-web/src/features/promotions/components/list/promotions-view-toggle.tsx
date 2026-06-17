import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { LayoutGrid, LayoutList } from "lucide-react"

interface PromotionsViewToggleProps {
  layout: "grid" | "list"
  onLayoutChange: (layout: "grid" | "list") => void
}

export function PromotionsViewToggle({
  layout,
  onLayoutChange,
}: PromotionsViewToggleProps) {
  return (
    <div className="flex shrink-0 items-center rounded-lg border border-border bg-muted/40 p-0.5">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onLayoutChange("list")}
        className={cn(
          "h-8 gap-1.5 rounded-md px-3 font-medium text-xs",
          layout === "list"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground"
        )}
      >
        <LayoutList className="size-3.5" aria-hidden />
        Table
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onLayoutChange("grid")}
        className={cn(
          "h-8 gap-1.5 rounded-md px-3 font-medium text-xs",
          layout === "grid"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground"
        )}
      >
        <LayoutGrid className="size-3.5" aria-hidden />
        Cards
      </Button>
    </div>
  )
}
