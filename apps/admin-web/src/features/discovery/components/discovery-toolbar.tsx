import { Input } from "@workspace/ui/components/input"
import { Search } from "lucide-react"

interface DiscoveryToolbarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function DiscoveryToolbar({
  search,
  onSearchChange,
}: DiscoveryToolbarProps) {
  return (
    <div className="relative ml-auto w-full sm:w-64">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search rails..."
        aria-label="Search rails"
        className="h-9 pl-9"
      />
    </div>
  )
}
