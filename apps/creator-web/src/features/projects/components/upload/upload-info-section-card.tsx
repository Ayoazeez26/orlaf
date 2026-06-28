import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"

interface UploadInfoSectionCardProps {
  icon: LucideIcon
  title: string
  subtitle: string
  children: React.ReactNode
  className?: string
}

export function UploadInfoSectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
  className,
}: UploadInfoSectionCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-foreground">{title}</p>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
