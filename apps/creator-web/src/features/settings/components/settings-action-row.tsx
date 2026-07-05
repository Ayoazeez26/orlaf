import type { ReactNode } from "react"

interface SettingsActionRowProps {
  title: string
  description: string
  action: ReactNode
  destructive?: boolean
}

export function SettingsActionRow({
  title,
  description,
  action,
  destructive = false,
}: SettingsActionRowProps) {
  return (
    <div className="flex flex-col gap-3 border-border border-b py-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p
          className={
            destructive
              ? "font-medium text-destructive text-sm"
              : "font-medium text-foreground text-sm"
          }
        >
          {title}
        </p>
        <p className="mt-0.5 text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  )
}
