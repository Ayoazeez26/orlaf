import { Button } from "@workspace/ui/components/button"
import { ChevronDown } from "lucide-react"

export function AnalyticsPageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Analytics
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Revenue, growth, retention and content performance at a glance.
        </p>
      </div>
      <Button type="button" variant="outline" className="shrink-0 gap-2">
        Last 30 days
        <ChevronDown className="size-4" aria-hidden />
      </Button>
    </div>
  )
}
