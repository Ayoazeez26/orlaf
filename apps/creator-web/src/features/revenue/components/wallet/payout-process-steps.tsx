import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowRight, Calendar, Coins, Lock } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"

const STEPS = [
  {
    icon: Coins,
    title: "Accrues daily",
    description: "Earnings land in your wallet every day.",
  },
  {
    icon: Lock,
    title: "Locked on the 28th",
    description: "Cycle closes for the month.",
  },
  {
    icon: Calendar,
    title: "Paid on the 1st",
    description: "Auto-sent to your primary method.",
  },
] as const

interface PayoutProcessStepsProps {
  className?: string
}

export function PayoutProcessSteps({ className }: PayoutProcessStepsProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardContent className="px-6">
        <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-start sm:gap-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon

            return (
              <div key={step.title} className="contents">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-payout-accent-muted">
                    <Icon
                      className="size-5 text-primary"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground text-sm">
                      {step.title}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <ArrowRight
                    className="mx-auto hidden size-5 shrink-0 self-center text-muted-foreground/50 sm:block"
                    aria-hidden
                  />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
