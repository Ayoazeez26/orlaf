import { Link } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowRight } from "lucide-react"
import { TONE_CHIP_CLASS } from "../../lib/tones"
import type { WorkspaceConfig } from "../../types"

interface RolePickerCardProps {
  config: WorkspaceConfig
}

export function RolePickerCard({ config }: RolePickerCardProps) {
  const { picker } = config
  const Icon = picker.icon

  return (
    <Link
      to="/workspace/$role"
      params={{ role: config.id }}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          TONE_CHIP_CLASS[picker.tone]
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>

      <div className="space-y-1.5">
        <h2 className="font-semibold text-base text-foreground tracking-tight">
          {picker.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {picker.description}
        </p>
      </div>

      <span className="mt-auto flex items-center gap-1.5 font-medium text-primary text-sm">
        Enter workspace
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  )
}
