import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Globe } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { formatCreatorViews } from "../../../data/creator-details"
import type { AudienceCountry } from "../../../types"

export function CreatorAudienceCountryCard({
  countries,
}: {
  countries: AudienceCountry[]
}) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-5 px-6">
        <h2 className="font-semibold text-foreground text-lg tracking-tight">
          Audience by Country
        </h2>

        <ul className="space-y-4">
          {countries.map((country) => (
            <li key={country.country} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Globe
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="font-medium text-foreground text-sm">
                    {country.country}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm tabular-nums">
                  <span className="text-muted-foreground">
                    {formatCreatorViews(country.count)}
                  </span>
                  <span className="w-8 text-right font-medium text-foreground">
                    {country.share}%
                  </span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${country.share}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
