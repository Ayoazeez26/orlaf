import { Input } from "@workspace/ui/components/input"
import { Search } from "lucide-react"

interface PromotionsListSearchProps {
  value: string
  onChange: (value: string) => void
}

export function PromotionsListSearch({
  value,
  onChange,
}: PromotionsListSearchProps) {
  return (
    <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search promotions"
        aria-label="Search promotions"
        className="h-10 rounded-xl border-border bg-card pr-3 pl-9 text-sm"
      />
    </div>
  )
}
