import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Clapperboard } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"

interface SoloCreatorStudioGateProps {
  workspaceName: string
}

export function SoloCreatorStudioGate({
  workspaceName,
}: SoloCreatorStudioGateProps) {
  return (
    <Card className={FROSTED_CARD_SURFACE_CLASS}>
      <CardContent className="flex flex-col items-center px-6 py-14 text-center sm:px-10 sm:py-16">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Clapperboard className="size-6" strokeWidth={1.75} aria-hidden />
        </span>

        <h2 className="mt-6 font-semibold text-foreground text-xl sm:text-2xl">
          {workspaceName} is a Solo Creator workspace
        </h2>

        <p className="mt-3 max-w-md text-muted-foreground text-sm leading-relaxed">
          Convert to a Studio to invite teammates, share revenue, and build a
          public brand page — your projects and earnings stay exactly where they
          are.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            className="h-11 min-w-[160px] rounded-xl px-6 font-medium"
          >
            Create new Studio
          </Button>
          <Button
            type="button"
            className="h-11 min-w-[160px] rounded-xl px-6 font-medium"
          >
            Convert to Studio
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
