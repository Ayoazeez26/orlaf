import { cn } from "@workspace/ui/lib/utils"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="h-9 w-[220px] rounded-full border border-border bg-card"
        aria-hidden
      />
    )
  }

  return (
    <fieldset className="flex items-center gap-0.5 rounded-full border border-border bg-card p-1">
      <legend className="sr-only">Theme</legend>
      {themes.map(({ value, label, icon: Icon }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-medium text-xs transition-colors",
              active
                ? "border border-border bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-3.5 shrink-0" aria-hidden />
            {label}
          </button>
        )
      })}
    </fieldset>
  )
}
