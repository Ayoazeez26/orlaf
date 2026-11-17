import { useCallback, useRef } from "react"
import {
  cancelUpload,
  findTrailerJob,
  startTrailerUpload,
} from "@/features/uploads/upload-runner"
import { getJobs } from "@/features/uploads/upload-store"
import { updateSeries } from "../api/studio-api"
import {
  uploadPoster as uploadPosterToR2,
  uploadSeriesPoster,
} from "../api/studio-upload"
import { probeMediaFile } from "../lib/media/probe-media"
import {
  MAX_TRAILER_FILE_BYTES,
  MAX_VIDEO_DURATION_SECONDS,
} from "../lib/media/upload-pipeline.types"
import { useUploadWizard } from "../upload/upload-wizard-context"

export function usePosterTrailerUpload() {
  const { state, dispatch, wizardId } = useUploadWizard()
  const posterAbortRef = useRef<AbortController | null>(null)
  const seriesIdRef = useRef(state.seriesId)
  seriesIdRef.current = state.seriesId
  const stateRef = useRef(state)
  stateRef.current = state
  const latestTrailerPick = useRef<symbol | null>(null)

  const uploadPoster = useCallback(
    async (file: File, previewObjectUrl: string) => {
      posterAbortRef.current?.abort()
      const abort = new AbortController()
      posterAbortRef.current = abort

      dispatch({
        type: "SET_POSTER",
        payload: {
          file,
          previewObjectUrl,
          status: "uploading",
          progress: 0,
        },
      })

      try {
        const seriesId = seriesIdRef.current
        const { imageUrl } = seriesId
          ? await uploadSeriesPoster(seriesId, file, (progress) => {
              dispatch({ type: "UPDATE_POSTER", payload: { progress } })
            })
          : await uploadPosterToR2(file, (progress) => {
              dispatch({ type: "UPDATE_POSTER", payload: { progress } })
            })

        if (abort.signal.aborted) return

        if (seriesId) {
          await updateSeries(seriesId, { posterUrl: imageUrl })
        }

        dispatch({
          type: "UPDATE_POSTER",
          payload: { status: "ready", progress: 1, remoteUrl: imageUrl },
        })
      } catch (error) {
        if (abort.signal.aborted) return
        const message =
          error instanceof Error ? error.message : "Poster upload failed"
        dispatch({
          type: "UPDATE_POSTER",
          payload: { status: "failed", error: message },
        })
      }
    },
    [dispatch]
  )

  const uploadTrailer = useCallback(
    async (file: File) => {
      // Drop the earlier trailer upload so its state isn't mirrored back
      // over the new file.
      const previousJob = findTrailerJob(getJobs(), {
        seriesId: seriesIdRef.current,
        wizardId,
      })
      if (previousJob) cancelUpload(previousJob.id)

      // Checking the file takes a moment; a newer pick or a removal in the
      // meantime wins.
      const pick = Symbol(file.name)
      latestTrailerPick.current = pick
      const isStale = () => latestTrailerPick.current !== pick

      if (file.size > MAX_TRAILER_FILE_BYTES) {
        dispatch({
          type: "SET_TRAILER",
          payload: {
            file,
            status: "failed",
            progress: 0,
            error: "Trailer exceeds the 100MB limit",
          },
        })
        return
      }

      dispatch({
        type: "SET_TRAILER",
        payload: { file, status: "probing", progress: 0 },
      })

      try {
        const probe = await probeMediaFile(file).catch(() => {
          throw new Error(
            "This file couldn't be read as a video. Export it as MP4 or MOV and try again."
          )
        })
        if (isStale()) return
        if (!probe.hasVideo) {
          throw new Error("This file has no video track. Choose a video file.")
        }

        if (
          probe.durationSeconds != null &&
          probe.durationSeconds > MAX_VIDEO_DURATION_SECONDS
        ) {
          dispatch({
            type: "UPDATE_TRAILER",
            payload: {
              status: "failed",
              durationSeconds: probe.durationSeconds,
              previewObjectUrl: probe.thumbnailObjectUrl ?? undefined,
              error: "Trailer exceeds the 5 minute duration limit",
            },
          })
          return
        }

        dispatch({
          type: "UPDATE_TRAILER",
          payload: {
            status: "queued",
            durationSeconds: probe.durationSeconds ?? undefined,
            previewObjectUrl: probe.thumbnailObjectUrl ?? undefined,
          },
        })
        dispatch({ type: "SET_TRAILER_URL", payload: null })

        // Runs in the background; useSyncUploadJobs mirrors its progress
        // into the wizard and the upload tray shows it everywhere else.
        const title = stateRef.current.title.trim()
        startTrailerUpload({
          seriesId: seriesIdRef.current,
          wizardId,
          title: title ? `${title} · Trailer` : "Trailer",
          file,
          aiVerticalConversion: stateRef.current.aiConversionEnabled,
          previewObjectUrl: probe.thumbnailObjectUrl ?? undefined,
          durationSeconds: probe.durationSeconds ?? undefined,
        })
      } catch (error) {
        if (isStale()) return
        const message =
          error instanceof Error ? error.message : "Trailer upload failed"
        dispatch({
          type: "UPDATE_TRAILER",
          payload: { status: "failed", error: message },
        })
      }
    },
    [dispatch, wizardId]
  )

  const clearPoster = useCallback(() => {
    posterAbortRef.current?.abort()
    dispatch({ type: "SET_POSTER", payload: null })
  }, [dispatch])

  const clearTrailer = useCallback(() => {
    latestTrailerPick.current = null
    const job = findTrailerJob(getJobs(), {
      seriesId: seriesIdRef.current,
      wizardId,
    })
    if (job) cancelUpload(job.id)
    dispatch({ type: "SET_TRAILER", payload: null })
    dispatch({ type: "SET_TRAILER_URL", payload: null })
  }, [dispatch, wizardId])

  return { uploadPoster, uploadTrailer, clearPoster, clearTrailer }
}
