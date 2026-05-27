import { Link } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { Plus } from "lucide-react"

interface AddProjectCardProps {
  variant?: "grid" | "list"
}

export function AddProjectCard({ variant = "grid" }: AddProjectCardProps) {
  return (
    <Link
      to="/dashboard/projects/new"
      search={{ step: "info" }}
      className={cn(
        "border-primary/35 border-dashed bg-card transition-colors hover:border-primary/50 dark:border-primary/40 dark:hover:border-primary/55",
        variant === "grid" &&
          "flex aspect-[4/2] w-full flex-col items-center justify-center gap-3 rounded-2xl border",
        variant === "list" &&
          "flex w-full items-center gap-4 border-t px-5 py-4"
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/15">
        <Plus className="size-5 text-foreground" strokeWidth={2} aria-hidden />
      </span>
      <span className="font-semibold text-foreground text-sm">
        Add New Series
      </span>
    </Link>
  )
}
