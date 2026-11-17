import { Link, useRouterState } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
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

/**
 * Floating panel listing every video upload. Uploads keep running while the
 * creator works elsewhere in the dashboard; this is where they check on them.
 */
export function UploadTray() {
  const jobs = useUploadJobs()
  const [collapsed, setCollapsed] = useState(false)
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
      className="fixed inset-x-4 bottom-4 z-50 overflow-hidden rounded-[16px] border bg-background shadow-lg sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px]"
    >
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground text-sm" role="status">
            {title}
          </p>
          {activeCount > 0 ? (
            <p className="text-muted-foreground text-xs">
              Keep this tab open until uploads finish.
            </p>
          ) : null}
        </div>
        <Button variant="ghost" size="xs" asChild>
          <Link to="/dashboard/uploads">See all</Link>
        </Button>
        {readyCount > 0 && activeCount === 0 ? (
          <Button variant="ghost" size="xs" onClick={clearFinishedUploads}>
            Clear
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="icon-xs"
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
        <ul className="max-h-[50vh] divide-y overflow-y-auto">
          {[...jobs].reverse().map((job) => (
            <UploadRow key={job.id} job={job} />
          ))}
        </ul>
      )}
    </section>
  )
}
