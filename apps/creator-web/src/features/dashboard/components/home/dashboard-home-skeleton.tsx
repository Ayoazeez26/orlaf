import { cn } from "@workspace/ui/lib/utils"

function Pulse({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-muted", className)} />
}

const METRIC_IDS = ["metric-a", "metric-b", "metric-c", "metric-d"] as const

export function MetricCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {METRIC_IDS.map((id) => (
        <Pulse key={id} className="h-[140px]" />
      ))}
    </div>
  )
}

export function DashboardHomeSkeleton() {
  return (
    <div className="space-y-6">
      <MetricCardsSkeleton />
      <Pulse className="h-[88px]" />
      <Pulse className="h-[280px]" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Pulse className="h-[360px] lg:col-span-2" />
        <Pulse className="h-[360px]" />
      </div>
    </div>
  )
}

export function ProjectAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <MetricCardsSkeleton />
      <div className="grid gap-4 lg:grid-cols-3">
        <Pulse className="h-[280px] lg:col-span-2" />
        <Pulse className="h-[280px]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Pulse className="h-[140px]" />
        <Pulse className="h-[140px]" />
        <Pulse className="h-[140px]" />
      </div>
    </div>
  )
}

export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Pulse className="h-4 w-32" />
      <Pulse className="h-48" />
      <Pulse className="h-10 w-72" />
      <MetricCardsSkeleton />
    </div>
  )
}
