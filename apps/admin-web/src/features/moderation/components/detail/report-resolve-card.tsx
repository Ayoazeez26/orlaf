import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Clock, XCircle } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { ModerationReportDetail } from "../../types"

interface ReportResolveCardProps {
  report: ModerationReportDetail
}

export function ReportResolveCard({ report }: ReportResolveCardProps) {
  const isPending = report.status === "pending"
  const isReviewed = report.status === "reviewed"
  const isResolved = report.status === "resolved"

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "h-fit py-6")}>
      <CardHeader className="px-5 pb-4 sm:px-6">
        <CardTitle className="font-semibold text-base">Resolve</CardTitle>
        <p className="text-muted-foreground text-sm">
          Update the report status as you triage it.
        </p>
      </CardHeader>

      <CardContent className="space-y-2 px-5 sm:px-6">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2"
          disabled={!isPending}
        >
          <Check className="size-4" aria-hidden />
          Mark as reviewed
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2"
          disabled={!isPending && !isReviewed}
        >
          <Check className="size-4" aria-hidden />
          Resolve report
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2"
          disabled={isPending}
        >
          <Clock className="size-4" aria-hidden />
          Reopen
        </Button>
        <Button
          type="button"
          className="w-full justify-start gap-2 bg-destructive text-white hover:bg-destructive/90"
          disabled={isResolved}
        >
          <XCircle className="size-4" aria-hidden />
          Dismiss report
        </Button>
      </CardContent>
    </Card>
  )
}
