import { cn } from "@workspace/ui/lib/utils"

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T | null
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
              selected
                ? "border-primary text-primary"
                : "border-border text-foreground hover:border-muted-foreground/50"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
