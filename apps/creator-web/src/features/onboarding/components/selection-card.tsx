import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"

interface SelectionCardProps {
  icon: LucideIcon
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

export function SelectionCard({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-1 flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all",
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-background hover:border-muted-foreground/40"
      )}
    >
      {selected && (
        <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}
      <Icon
        className={cn(
          "size-6",
          selected ? "text-primary" : "text-muted-foreground"
        )}
      />
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
      </div>
    </button>
  )
}
