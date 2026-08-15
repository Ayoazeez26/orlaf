import { MetricCardsSkeleton } from "@/features/dashboard/components/home/dashboard-home-skeleton"

export function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-8">
      <MetricCardsSkeleton />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-[360px] animate-pulse rounded-2xl bg-muted lg:col-span-2" />
        <div className="h-[360px] animate-pulse rounded-2xl bg-muted" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-[360px] animate-pulse rounded-2xl bg-muted lg:col-span-2" />
        <div className="h-[360px] animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  )
}
