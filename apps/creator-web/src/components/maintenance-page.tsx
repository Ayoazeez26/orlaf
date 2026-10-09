import { Wrench } from "lucide-react"

export function MaintenancePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Wrench className="size-6 text-muted-foreground" aria-hidden />
      </div>
      <h1 className="font-semibold text-2xl text-foreground">
        Sable is undergoing maintenance
      </h1>
      <p className="max-w-sm text-muted-foreground text-sm">
        We're making some improvements behind the scenes. Please check back
        shortly.
      </p>
    </div>
  )
}
