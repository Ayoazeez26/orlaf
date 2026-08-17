import type { ModerationStats } from "@sable/contracts"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import { AlertTriangle, CheckCircle2, Clock, ShieldCheck } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import type { ModerationReport } from "../types"

interface ModerationStatCardsProps {
  reports: ModerationReport[]
  stats?: ModerationStats
}

interface Stat {
  label: string
  value: number
  icon: LucideIcon
  tone: Tone
}

export function ModerationStatCards({
  reports,
  stats,
}: ModerationStatCardsProps) {
  const pending =
    stats?.pending ??
    reports.filter((report) => report.status === "pending").length
  const reviewed =
    stats?.reviewed ??
    reports.filter((report) => report.status === "reviewed").length
  const resolved =
    stats?.resolved ??
    reports.filter((r) => r.status === "resolved" || r.status === "dismissed")
      .length
  const statsList: Stat[] = [
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      tone: "danger",
    },
    {
      label: "High severity",
      value: reports.filter((report) => report.severity === "high").length,
      icon: AlertTriangle,
      tone: "warning",
    },
    {
      label: "Reviewed",
      value: reviewed,
      icon: ShieldCheck,
      tone: "primary",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: CheckCircle2,
      tone: "positive",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statsList.map((stat) => {
        const Icon = stat.icon

        return (
          <Card
            key={stat.label}
            className={cn(FROSTED_CARD_SURFACE_CLASS, "py-5")}
          >
            <CardContent className="flex items-center gap-4 p-0 px-5">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  TONE_CHIP_CLASS[stat.tone]
                )}
              >
                <Icon className="size-5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-muted-foreground text-xs">
                  {stat.label}
                </p>
                <p className="font-bold text-2xl text-foreground tracking-tight">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
