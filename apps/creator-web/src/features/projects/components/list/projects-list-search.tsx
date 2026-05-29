import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ProjectsListSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ProjectsListSearch({
  value,
  onChange,
}: ProjectsListSearchProps) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  function closeSearch() {
    setOpen(false)
    onChange("")
  }

  return (
    <div
      className={cn(
        "flex shrink-0 overflow-hidden transition-[width] duration-200 ease-out",
        open ? "w-52 sm:w-64" : "w-8"
      )}
    >
      {open ? (
        <div className="relative flex w-full min-w-0 items-center">
          <Search
            className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground"
            aria-hidden
          />
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search title or genre…"
            aria-label="Search projects by title or genre"
            className="h-8 border-border bg-card pr-8 pl-8 text-sm focus-visible:border-ring focus-visible:ring-0"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Close search"
            onClick={closeSearch}
            className="absolute right-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Search projects"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="bg-card text-muted-foreground"
        >
          <Search className="size-4" aria-hidden />
        </Button>
      )}
    </div>
  )
}
