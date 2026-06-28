import { useCallback, useRef } from "react"
import { updateSeries } from "../api/studio-api"
import {
  uploadPoster as uploadPosterToR2,
  uploadSeriesPoster,
  uploadSeriesTrailer,
  uploadWizardTrailer,
  waitForTrailerReady,
} from "../api/studio-upload"
import { convertForUpload } from "../lib/media/convert-for-upload"
import { probeMediaFile } from "../lib/media/probe-media"
import {
  MAX_TRAILER_FILE_BYTES,
  MAX_VIDEO_DURATION_SECONDS,
} from "../lib/media/upload-pipeline.types"
import { useUploadWizard } from "../upload/upload-wizard-context"

export function usePosterTrailerUpload() {
  const { state, dispatch } = useUploadWizard()
  const posterAbortRef = useRef<AbortController | null>(null)
  const trailerAbortRef = useRef<AbortController | null>(null)
  const seriesIdRef = useRef(state.seriesId)
  seriesIdRef.current = state.seriesId

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
      trailerAbortRef.current?.abort()
      const abort = new AbortController()
      trailerAbortRef.current = abort

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
        payload: {
          file,
          status: "probing",
          progress: 0,
        },
      })

      try {
        const probe = await probeMediaFile(file)
        if (abort.signal.aborted) return

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
            status: "converting",
            durationSeconds: probe.durationSeconds ?? undefined,
            previewObjectUrl: probe.thumbnailObjectUrl ?? undefined,
          },
        })

        const converted = await convertForUpload(file, {
          aiVerticalConversion: state.aiConversionEnabled,
          signal: abort.signal,
          onProgress: (update) => {
            if (update.phase === "converting") {
              dispatch({
                type: "UPDATE_TRAILER",
                payload: { progress: update.value },
              })
            }
          },
        })

        if (
          converted.durationSeconds != null &&
          converted.durationSeconds > MAX_VIDEO_DURATION_SECONDS
        ) {
          throw new Error("Trailer exceeds the 5 minute duration limit")
        }

        if (abort.signal.aborted) return

        dispatch({ type: "UPDATE_TRAILER", payload: { status: "uploading" } })

        const seriesId = seriesIdRef.current
        const { videoId } = seriesId
          ? await uploadSeriesTrailer(
              seriesId,
              converted.blob,
              (progress) => {
                dispatch({ type: "UPDATE_TRAILER", payload: { progress } })
              },
              converted.fileName
            )
          : await uploadWizardTrailer(
              converted.blob,
              "video/mp4",
              (progress) => {
                dispatch({ type: "UPDATE_TRAILER", payload: { progress } })
              },
              converted.fileName
            )

        if (abort.signal.aborted) return

        dispatch({
          type: "UPDATE_TRAILER",
          payload: { status: "processing", videoHostingId: videoId },
        })

        const hlsUrl = await waitForTrailerReady(videoId, {
          timeoutMs: 600_000,
        })
        if (abort.signal.aborted) return

        if (seriesId) {
          await updateSeries(seriesId, { trailerUrl: hlsUrl })
        }

        dispatch({
          type: "UPDATE_TRAILER",
          payload: { status: "ready", progress: 1 },
        })
        dispatch({ type: "SET_TRAILER_URL", payload: hlsUrl })
      } catch (error) {
        if (abort.signal.aborted) return
        const message =
          error instanceof Error ? error.message : "Trailer upload failed"
        dispatch({
          type: "UPDATE_TRAILER",
          payload: { status: "failed", error: message },
        })
        dispatch({ type: "SET_TRAILER_URL", payload: null })
      }
    },
    [dispatch, state.aiConversionEnabled]
  )

  const clearPoster = useCallback(() => {
    posterAbortRef.current?.abort()
    dispatch({ type: "SET_POSTER", payload: null })
  }, [dispatch])

  const clearTrailer = useCallback(() => {
    trailerAbortRef.current?.abort()
    dispatch({ type: "SET_TRAILER", payload: null })
    dispatch({ type: "SET_TRAILER_URL", payload: null })
  }, [dispatch])

  return { uploadPoster, uploadTrailer, clearPoster, clearTrailer }
}
