import {
  getPasswordStrength,
  PASSWORD_REQUIREMENT_LABELS,
  type PasswordRequirement,
} from "@sable/contracts"
import { cn } from "@workspace/ui/lib/utils"
import { Check } from "lucide-react"

const STRENGTH_COLORS: Record<
  ReturnType<typeof getPasswordStrength>["label"],
  string
> = {
  Weak: "bg-destructive",
  Fair: "bg-amber-500",
  Good: "bg-primary",
  Strong: "bg-emerald-500",
}

const STRENGTH_TEXT: Record<
  ReturnType<typeof getPasswordStrength>["label"],
  string
> = {
  Weak: "text-destructive",
  Fair: "text-amber-600 dark:text-amber-400",
  Good: "text-primary",
  Strong: "text-emerald-600 dark:text-emerald-400",
}

interface PasswordStrengthBarProps {
  password: string
  className?: string
}

export function PasswordStrengthBar({
  password,
  className,
}: PasswordStrengthBarProps) {
  if (!password) return null

  const strength = getPasswordStrength(password)
  const requirements = Object.entries(strength.requirements) as [
    PasswordRequirement,
    boolean,
  ][]

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                STRENGTH_COLORS[strength.label]
              )}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
          <span
            className={cn(
              "shrink-0 font-medium text-xs",
              STRENGTH_TEXT[strength.label]
            )}
          >
            {strength.label}
          </span>
        </div>
      </div>

      <ul className="grid gap-1.5 sm:grid-cols-2">
        {requirements.map(([key, met]) => (
          <li
            key={key}
            className={cn(
              "flex items-center gap-2 text-xs",
              met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            )}
          >
            <Check
              className={cn("size-3.5 shrink-0", !met && "opacity-30")}
              aria-hidden
            />
            {PASSWORD_REQUIREMENT_LABELS[key]}
          </li>
        ))}
      </ul>
    </div>
  )
}
