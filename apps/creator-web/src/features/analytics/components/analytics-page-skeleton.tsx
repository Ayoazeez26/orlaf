export function AnalyticsPageSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(["a", "b", "c", "d"] as const).map((id) => (
          <div key={id} className="h-[140px] rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-[360px] rounded-2xl bg-muted lg:col-span-2" />
        <div className="h-[360px] rounded-2xl bg-muted" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-[360px] rounded-2xl bg-muted lg:col-span-2" />
        <div className="h-[360px] rounded-2xl bg-muted" />
      </div>
    </div>
  )
}
