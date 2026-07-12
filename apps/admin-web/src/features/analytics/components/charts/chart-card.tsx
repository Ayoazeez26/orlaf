import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { ReactNode } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"

interface ChartCardProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function ChartCard({
  title,
  subtitle,
  action,
  className,
  children,
}: ChartCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="flex items-start justify-between gap-3 pb-4">
        <div className="space-y-1">
          <p className="font-semibold text-foreground text-lg tracking-tight">
            {title}
          </p>
          {subtitle ? (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="pr-1 pl-0 sm:px-6">{children}</CardContent>
    </Card>
  )
}
