import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Megaphone } from "lucide-react"

export function PromotionBanner() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E4EA] border-dashed bg-[#EDEEFF66] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary">
          <Megaphone className="size-5 text-white" aria-hidden />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground text-sm">
            Boost your next premiere
          </p>
          <p className="max-w-xl text-muted-foreground text-sm">
            Run a promotion to reach more streamers in your region.
          </p>
        </div>
      </div>
      <Button
        type="button"
        asChild
        className="shrink-0 gap-2 self-start sm:self-center"
      >
        <Link to="/dashboard/promotions">
          <Megaphone className="size-4" aria-hidden />
          Create promotion
        </Link>
      </Button>
    </div>
  )
}
