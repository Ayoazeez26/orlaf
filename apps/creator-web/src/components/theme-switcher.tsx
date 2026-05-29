import { cn } from "@workspace/ui/lib/utils"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

interface ThemeSwitcherProps {
  /** Hides text labels below `sm` — for sidebars and narrow headers */
  compact?: boolean
}

export function ThemeSwitcher({ compact = false }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 rounded-full border border-border bg-card",
          compact ? "w-30 sm:w-[220px]" : "w-[220px]"
        )}
        aria-hidden
      />
    )
  }

  return (
    <fieldset
      className={cn(
        "flex max-w-full items-center gap-0.5 rounded-full border border-border bg-card p-1",
        compact && "w-full sm:w-auto"
      )}
    >
      <legend className="sr-only">Theme</legend>
      {themes.map(({ value, label, icon: Icon }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 font-medium text-xs transition-colors sm:flex-none sm:px-2.5",
              active
                ? "border border-border bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-3.5 shrink-0" aria-hidden />
            <span className={cn(compact && "sr-only sm:not-sr-only")}>
              {label}
            </span>
          </button>
        )
      })}
    </fieldset>
  )
}
