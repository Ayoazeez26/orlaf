import { useCallback, useState } from "react"
import { fetchPreferences } from "@/features/settings/api/preferences-api"
import { toast, toastMutationError } from "@/lib/toast"
import { publishSeries } from "../api/studio-api"
import { getSubmitBlocker } from "../lib/episode-step-ready"
import { formatDuration } from "../lib/media/format-duration"
import { ProbeTimeoutError, probeMediaFile } from "../lib/media/probe-media"
import type { UploadWizardState } from "../types"

export interface PublishProgress {
  phase: "submitting" | "done"
  label: string
  value: number
}

function validateForPublish(state: UploadWizardState): string | null {
  if (!state.seriesId) {
    return "Series has not been created yet"
  }

  if (state.episodes.length === 0) {
    return null
  }

  return getSubmitBlocker(state)
}

export function useMediaUploadPipeline() {
  const [isPublishing, setIsPublishing] = useState(false)
  const [progress, setProgress] = useState<PublishProgress | null>(null)

  const publish = useCallback(async (state: UploadWizardState) => {
    const validationError = validateForPublish(state)
    if (validationError) {
      toast.error(validationError)
      throw new Error(validationError)
    }

    setIsPublishing(true)

    let publishLabel = "Submitting for review…"
    try {
      const prefs = await fetchPreferences()
      if (prefs.autoPublishAfterProcessing) {
        publishLabel = "Publishing…"
      }
    } catch {
      // fall back to review copy
    }

    setProgress({
      phase: "submitting",
      label: publishLabel,
      value: 0.5,
    })

    const seriesId = state.seriesId
    if (!seriesId) {
      throw new Error("Series has not been created yet")
    }

    try {
      const series = await publishSeries(seriesId)
      setProgress({ phase: "done", label: "Submitted", value: 1 })
      if (series.submitRequestedAt) {
        toast.success(
          "Submitted. It goes to review as soon as your videos finish processing."
        )
      } else {
        toast.success("Submitted for review.")
      }
      return seriesId
    } catch (error) {
      toastMutationError(error, "Publish failed")
      throw error
    } finally {
      setIsPublishing(false)
    }
  }, [])

  return {
    publish,
    isPublishing,
    progress,
  }
}

/**
 * Reads duration and a preview frame. Throws a readable error when the file
 * isn't a video Cloudflare could accept.
 */
export async function probeAndCreateMediaAsset(file: File) {
  let probe: Awaited<ReturnType<typeof probeMediaFile>>
  try {
    probe = await probeMediaFile(file)
  } catch (error) {
    if (error instanceof ProbeTimeoutError) {
      // Don't leave the creator stuck on "Analyzing…": upload without a
      // preview. Cloudflare still validates the file.
      return {
        file,
        status: "idle" as const,
        progress: 0,
        durationSeconds: undefined,
        previewObjectUrl: undefined,
      }
    }
    throw new Error(
      "This file couldn't be read as a video. Export it as MP4 or MOV and try again."
    )
  }
  if (!probe.hasVideo) {
    throw new Error("This file has no video track. Choose a video file.")
  }
  return {
    file,
    status: "idle" as const,
    progress: 0,
    durationSeconds: probe.durationSeconds ?? undefined,
    previewObjectUrl: probe.thumbnailObjectUrl ?? undefined,
  }
}

export function formatMediaDuration(seconds: number | null | undefined) {
  return formatDuration(seconds)
}
