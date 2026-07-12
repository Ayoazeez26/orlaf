import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
import { SableBrandMark } from "@/components/sable-brand-mark"
import { useSimulatedProgress } from "@/hooks/use-simulated-progress"

type ProgressMode = "simulated" | "controlled"

interface AppLoadingScreenProps {
  className?: string
  /** Controlled 0–100 value from a real multi-step loader. */
  progress?: number
  /** Use an asymptotic timer when no real progress source exists. */
  mode?: ProgressMode
  /** Snap simulated progress to 100%. */
  completed?: boolean
  title?: string
  message?: string
  subtitle?: string
}

function messageForProgress(progress: number, fallback: string) {
  if (progress < 20) return "Starting up…"
  if (progress < 45) return "Refreshing your session…"
  if (progress < 75) return "Loading your studio…"
  if (progress < 95) return "Almost there…"
  return fallback
}

export function AppLoadingScreen({
  className,
  progress,
  mode = "controlled",
  completed = false,
  title = "Getting things ready",
  message,
  subtitle = "Creators",
}: AppLoadingScreenProps) {
  const simulatedProgress = useSimulatedProgress({
    active: mode === "simulated",
    completed,
  })
  const displayProgress =
    mode === "simulated" ? simulatedProgress : Math.min(100, progress ?? 0)

  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAnimatedProgress(displayProgress)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [displayProgress])

  const statusMessage =
    message ?? messageForProgress(displayProgress, "Finishing up…")

  return (
    <div
      className={cn(
        "relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />

      <div className="relative w-full max-w-sm text-center">
        <SableBrandMark subtitle={subtitle} className="mb-8" />

        <p className="font-medium text-foreground text-sm tracking-tight">
          {title}
        </p>
        <p className="mt-1 text-muted-foreground text-sm">{statusMessage}</p>

        <div className="mt-8 space-y-3">
          <Progress
            value={animatedProgress}
            className="h-2 bg-muted/80"
            aria-label="Loading progress"
          />
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Please wait</span>
            <span className="tabular-nums">{displayProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
