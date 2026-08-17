import { useCallback, useState } from "react"
import { fetchPreferences } from "@/features/settings/api/preferences-api"
import { toast, toastMutationError } from "@/lib/toast"
import { publishSeries } from "../api/studio-api"
import { formatDuration } from "../lib/media/format-duration"
import { probeMediaFile } from "../lib/media/probe-media"
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

  const incomplete = state.episodes.filter((ep) => ep.media?.status !== "ready")

  if (incomplete.length > 0) {
    return "All episodes must finish uploading before publishing"
  }

  return null
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
      await publishSeries(seriesId)
      setProgress({ phase: "done", label: "Submitted", value: 1 })
      toast.success("Submitted for review.")
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

export async function probeAndCreateMediaAsset(file: File) {
  const probe = await probeMediaFile(file)
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
