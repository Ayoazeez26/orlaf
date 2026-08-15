import { cn } from "@workspace/ui/lib/utils"

function Pulse({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-muted", className)} />
}

const METRIC_IDS = ["metric-a", "metric-b", "metric-c", "metric-d"] as const
const ROW_IDS = ["row-a", "row-b", "row-c", "row-d", "row-e"] as const

export function MetricCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {METRIC_IDS.map((id) => (
        <Pulse key={id} className="h-[116px]" />
      ))}
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-6">
      <MetricCardsSkeleton />
      <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
        <Pulse className="h-[420px] lg:col-span-2" />
        <div className="space-y-4">
          <Pulse className="h-[200px]" />
          <Pulse className="h-[200px]" />
        </div>
      </div>
    </div>
  )
}

export function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6">
      <MetricCardsSkeleton />
      <div className="grid gap-4 lg:grid-cols-2">
        <Pulse className="h-[320px]" />
        <Pulse className="h-[320px]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Pulse className="h-[320px]" />
        <Pulse className="h-[320px]" />
      </div>
    </div>
  )
}

export function AnalyticsTabSkeleton() {
  return (
    <div className="space-y-6">
      <MetricCardsSkeleton />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Pulse className="h-[280px]" />
        <Pulse className="h-[280px]" />
        <Pulse className="h-[280px]" />
        <Pulse className="h-[280px]" />
      </div>
    </div>
  )
}

export function TablePageSkeleton() {
  return (
    <div className="space-y-6">
      <MetricCardsSkeleton />
      <Pulse className="h-[52px]" />
      <div className="space-y-3">
        {ROW_IDS.map((id) => (
          <Pulse key={id} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function TableRowsSkeleton() {
  return (
    <div className="space-y-3 py-2">
      {ROW_IDS.map((id) => (
        <Pulse key={id} className="h-14 rounded-xl" />
      ))}
    </div>
  )
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      <Pulse className="h-4 w-40" />
      <Pulse className="h-40" />
      <Pulse className="h-10 w-80" />
      <Pulse className="h-64" />
    </div>
  )
}
