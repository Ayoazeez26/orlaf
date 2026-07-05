import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import type { ReactNode } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"

interface SettingsSectionCardProps {
  title: string
  description?: string
  children: ReactNode
  headerAction?: ReactNode
  className?: string
}

export function SettingsSectionCard({
  title,
  description,
  children,
  headerAction,
  className,
}: SettingsSectionCardProps) {
  return (
    <Card className={`${FROSTED_CARD_SURFACE_CLASS} ${className ?? ""}`}>
      <CardHeader
        className={
          headerAction
            ? "flex flex-row flex-wrap items-start justify-between gap-3 space-y-0"
            : undefined
        }
      >
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          {description ? (
            <p className="mt-1 text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
        {headerAction}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
