import { cn } from "@workspace/ui/lib/utils"
import { CirclePlay, Home } from "lucide-react"
import type { DiscoverySurface } from "../types"

interface DiscoverySurfaceToggleProps {
  active: DiscoverySurface
  onChange: (surface: DiscoverySurface) => void
}

const SURFACES: {
  key: DiscoverySurface
  label: string
  icon: typeof Home
}[] = [
  { key: "home", label: "Home / Discover", icon: Home },
  { key: "for-you", label: "For You", icon: CirclePlay },
]

export function DiscoverySurfaceToggle({
  active,
  onChange,
}: DiscoverySurfaceToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-muted/40 p-1">
      {SURFACES.map((surface) => {
        const Icon = surface.icon
        const isActive = surface.key === active

        return (
          <button
            key={surface.key}
            type="button"
            onClick={() => onChange(surface.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-medium text-sm transition-colors",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {surface.label}
          </button>
        )
      })}
    </div>
  )
}
