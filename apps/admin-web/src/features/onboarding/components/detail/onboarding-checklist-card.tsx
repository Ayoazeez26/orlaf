import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { CheckCircle2, Circle } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { ChecklistStep } from "../../types"

interface OnboardingChecklistCardProps {
  steps: ChecklistStep[]
}

export function OnboardingChecklistCard({
  steps,
}: OnboardingChecklistCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "h-full py-6")}>
      <CardHeader className="px-5 pb-4 sm:px-6">
        <CardTitle className="font-semibold text-base">
          Onboarding checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 sm:px-6">
        <ul className="space-y-4">
          {steps.map((step) => (
            <li key={step.id} className="flex items-center gap-3">
              {step.completed ? (
                <CheckCircle2
                  className="size-5 shrink-0 text-emerald-500"
                  aria-hidden
                />
              ) : (
                <Circle
                  className="size-5 shrink-0 text-muted-foreground/50"
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  "text-sm",
                  step.completed ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
