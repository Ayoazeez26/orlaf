import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Clock,
  DollarSign,
  Eye,
  Heart,
  LineChart,
  Share2,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { AnalyticsKpi, AnalyticsKpiIcon } from "../../types"
import { TrendBadge } from "./trend-badge"

const ICON_MAP: Record<AnalyticsKpiIcon, typeof Eye> = {
  views: Eye,
  viewers: Users,
  watchTime: Clock,
  engagement: TrendingUp,
  completion: LineChart,
  likes: Heart,
  shares: Share2,
  subscribers: UserPlus,
  dollar: DollarSign,
  chart: LineChart,
  clock: Clock,
  creditCard: Banknote,
}

const VS_LAST_PERIOD_SUFFIX = " vs last period"

function parseTrendFootnote(footnote: string) {
  const cleaned = footnote.replace(/^↗\s*/, "").trim()
  if (cleaned.endsWith(VS_LAST_PERIOD_SUFFIX)) {
    return {
      value: cleaned.slice(0, -VS_LAST_PERIOD_SUFFIX.length).trim(),
      suffix: "vs last period",
    }
  }

  return { value: cleaned, suffix: null }
}

function TrendFootnote({ footnote }: { footnote: string }) {
  const { value, suffix } = parseTrendFootnote(footnote)
  const isPositive = !value.trim().startsWith("-")
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight
  const trendColor = isPositive ? "text-trend-positive" : "text-trend-negative"

  return (
    <p className="flex flex-wrap items-center gap-1 text-sm">
      <Icon className={cn("size-4 shrink-0", trendColor)} aria-hidden />
      <span className={cn("font-medium", trendColor)}>{value}</span>
      {suffix ? <span className="text-muted-foreground">{suffix}</span> : null}
    </p>
  )
}

interface AnalyticsMetricCardProps {
  kpi: AnalyticsKpi
  className?: string
  showTrend?: boolean
}

export function AnalyticsMetricCard({
  kpi,
  className,
  showTrend = true,
}: AnalyticsMetricCardProps) {
  const Icon = ICON_MAP[kpi.icon]

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardContent className="flex flex-col gap-4 p-0 px-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            {kpi.label}
          </span>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" strokeWidth={2} aria-hidden />
          </span>
        </div>

        <p className="font-bold font-space-grotesk text-2xl text-foreground tracking-tight">
          {kpi.value}
        </p>

        {showTrend &&
          (kpi.footnote ? (
            <TrendFootnote footnote={kpi.footnote} />
          ) : kpi.changePercent !== undefined ? (
            <TrendBadge changePercent={kpi.changePercent} variant="inline" />
          ) : null)}
      </CardContent>
    </Card>
  )
}
