import { Link, useRouterState } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"
import { clearFinishedUploads } from "../upload-runner"
import { isJobActive, useUploadJobs } from "../upload-store"
import { UploadRow } from "./upload-row"

/** Warns before closing the tab while files are still being sent. */
function useLeaveWarning(active: boolean) {
  useEffect(() => {
    if (!active) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      // Older browsers need returnValue set to show the prompt.
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [active])
}

/** Re-render once a second while uploading so time-left estimates move. */
function useTicker(active: boolean) {
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(() => setTick((tick) => tick + 1), 1000)
    return () => window.clearInterval(timer)
  }, [active])
}

function isSmallScreen() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 639px)").matches
  )
}

/**
 * Floating panel listing every video upload. Uploads keep running while the
 * creator works elsewhere in the dashboard; this is where they check on them.
 */
export function UploadTray() {
  const jobs = useUploadJobs()
  // Phones start with just the summary bar so the tray doesn't take over the
  // screen; tapping it opens the list.
  const [collapsed, setCollapsed] = useState(isSmallScreen)
  const onUploadsPage = useRouterState({
    select: (state) => state.location.pathname === "/dashboard/uploads",
  })

  const activeCount = jobs.filter(isJobActive).length
  const pausedCount = jobs.filter((job) => job.phase === "paused").length
  const sendingCount = activeCount - pausedCount
  const uploading = jobs.some((job) => job.phase === "uploading")
  const failedCount = jobs.filter(
    (job) => job.phase === "failed" || job.phase === "interrupted"
  ).length
  const processingCount = jobs.filter(
    (job) => job.phase === "processing"
  ).length
  const readyCount = jobs.filter((job) => job.phase === "ready").length

  useLeaveWarning(activeCount > 0)
  useTicker(uploading)

  // The Uploads page shows the same list in full.
  if (jobs.length === 0 || onUploadsPage) return null

  const title =
    sendingCount > 0
      ? `Uploading ${sendingCount} ${sendingCount === 1 ? "video" : "videos"}${pausedCount > 0 ? `, ${pausedCount} paused` : ""}`
      : pausedCount > 0
        ? `${pausedCount} ${pausedCount === 1 ? "upload" : "uploads"} paused`
        : failedCount > 0
          ? `${failedCount} ${failedCount === 1 ? "upload needs" : "uploads need"} attention`
          : processingCount > 0
            ? `Processing ${processingCount} ${processingCount === 1 ? "video" : "videos"}`
            : "Uploads complete"

  const overall =
    activeCount > 0
      ? jobs.filter(isJobActive).reduce((sum, job) => sum + job.progress, 0) /
        activeCount
      : null

  return (
    <section
      aria-label="Video uploads"
      // Phones: docked under the page so it never covers buttons. Larger
      // screens: a floating panel in the corner.
      className="z-40 shrink-0 overflow-hidden border-t bg-background pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:fixed sm:right-6 sm:bottom-6 sm:z-50 sm:w-[380px] sm:rounded-[16px] sm:border sm:pb-0 sm:shadow-lg"
    >
      <header
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 sm:py-3",
          !collapsed && "border-b"
        )}
      >
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
        >
          <p
            className="truncate font-semibold text-foreground text-sm"
            role="status"
          >
            {title}
          </p>
          {activeCount > 0 ? (
            <p className="text-muted-foreground text-xs">
              Keep this tab open until uploads finish.
            </p>
          ) : null}
        </button>
        <Button variant="ghost" size="xs" className="max-sm:h-9" asChild>
          <Link to="/dashboard/uploads">See all</Link>
        </Button>
        {readyCount > 0 && activeCount === 0 ? (
          <Button
            variant="ghost"
            size="xs"
            className="max-sm:h-9"
            onClick={clearFinishedUploads}
          >
            Clear
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="icon-xs"
          className="max-sm:size-9"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Show uploads" : "Hide uploads"}
        >
          {collapsed ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
        </Button>
      </header>
      {collapsed ? (
        overall != null ? (
          <Progress
            value={overall * 100}
            className="rounded-none"
            aria-label="Overall upload progress"
          />
        ) : null
      ) : (
        <ul className="max-h-[40svh] divide-y overflow-y-auto overscroll-contain sm:max-h-[50vh]">
          {[...jobs].reverse().map((job) => (
            <UploadRow key={job.id} job={job} />
          ))}
        </ul>
      )}
    </section>
  )
}
