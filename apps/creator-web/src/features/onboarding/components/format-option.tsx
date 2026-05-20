import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FormatOptionProps {
  icon: LucideIcon
  label: string
  selected: boolean
  onClick: () => void
}

export function FormatOption({
  icon: Icon,
  label,
  selected,
  onClick,
}: FormatOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left font-medium text-sm transition-all",
        selected
          ? "border-primary text-primary"
          : "border-border bg-input-bg text-foreground hover:border-muted-foreground/40"
      )}
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          selected ? "text-primary" : "text-muted-foreground"
        )}
      />
      {label}
    </button>
  )
}
