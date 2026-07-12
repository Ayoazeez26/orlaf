import { Input } from "@workspace/ui/components/input"
import { Search } from "lucide-react"

interface ProjectsListSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ProjectsListSearch({
  value,
  onChange,
}: ProjectsListSearchProps) {
  return (
    <div className="relative w-full min-w-[200px]">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search projects"
        aria-label="Search projects"
        className="h-10 rounded-xl border-border bg-card pr-3 pl-9 text-sm"
      />
    </div>
  )
}
