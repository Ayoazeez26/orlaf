export function SettingsPageSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6 lg:flex-row">
      <div className="h-[420px] w-full rounded-2xl bg-muted lg:w-[220px]" />
      <div className="min-w-0 flex-1 space-y-6">
        <div className="h-[360px] rounded-2xl bg-muted" />
        <div className="h-[260px] rounded-2xl bg-muted" />
      </div>
    </div>
  )
}
