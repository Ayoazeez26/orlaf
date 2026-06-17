import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { SupportOption } from "../../constants"

interface SupportOptionCardProps {
  option: SupportOption
  className?: string
}

export function SupportOptionCard({
  option,
  className,
}: SupportOptionCardProps) {
  const Icon = option.icon
  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="size-5 text-primary" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="font-semibold text-foreground text-sm">{option.title}</p>
        <p className="text-muted-foreground text-sm">{option.description}</p>
      </div>
    </>
  )

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardContent className="p-0 px-6">
        {option.href ? (
          <a
            href={option.href}
            className="flex flex-col items-start gap-4 transition-opacity hover:opacity-80"
          >
            {content}
          </a>
        ) : (
          <div className="flex items-start gap-4">{content}</div>
        )}
      </CardContent>
    </Card>
  )
}
