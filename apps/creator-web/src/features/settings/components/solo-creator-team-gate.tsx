import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { UserPlus } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"

export function SoloCreatorTeamGate() {
  return (
    <Card className={FROSTED_CARD_SURFACE_CLASS}>
      <CardContent className="flex flex-col items-center px-6 py-14 text-center sm:px-10 sm:py-16">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UserPlus className="size-6" strokeWidth={1.75} aria-hidden />
        </span>

        <h2 className="mt-6 font-semibold text-foreground text-xl sm:text-2xl">
          You&apos;re working solo
        </h2>

        <p className="mt-3 max-w-md text-muted-foreground text-sm leading-relaxed">
          Teams are available in Studio workspaces. Convert to invite producers,
          editors, and collaborators.
        </p>

        <Button type="button" className="mt-8 gap-2 rounded-xl px-6">
          <UserPlus className="size-4" aria-hidden />
          Convert to Studio
        </Button>
      </CardContent>
    </Card>
  )
}
