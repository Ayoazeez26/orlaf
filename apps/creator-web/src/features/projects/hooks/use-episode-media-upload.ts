import { useCallback, useRef } from "react"
import {
  createEpisode,
  getEpisodeUploadUrl,
  waitForEpisodeStatus,
} from "../api/studio-api"
import { uploadToCloudflareStream } from "../api/studio-upload"
import { convertForUpload } from "../lib/media/convert-for-upload"
import {
  isUploadUrlExpiredError,
  withEpisodeUploadSlot,
} from "../lib/media/episode-upload-queue"
import {
  MAX_EPISODE_FILE_BYTES,
  MAX_VIDEO_DURATION_SECONDS,
} from "../lib/media/upload-pipeline.types"
import type { EpisodeAccess } from "../types"
import { useUploadWizard } from "../upload/upload-wizard-context"
import {
  formatMediaDuration,
  probeAndCreateMediaAsset,
} from "./use-media-upload-pipeline"

function mapEpisodeAccess(access: EpisodeAccess) {
  switch (access) {
    case "coins":
      return "coin_gated" as const
    case "premium":
      return "premium" as const
    default:
      return "free" as const
  }
}

export function useEpisodeMediaUpload() {
  const { state, dispatch } = useUploadWizard()
  const abortMapRef = useRef(new Map<string, AbortController>())
  const seriesIdRef = useRef(state.seriesId)
  const episodesRef = useRef(state.episodes)
  seriesIdRef.current = state.seriesId
  episodesRef.current = state.episodes

  const uploadEpisode = useCallback(
    async (episodeId: string, file: File) => {
      return withEpisodeUploadSlot(async () => {
        const seriesId = seriesIdRef.current
        if (!seriesId) {
          throw new Error("Series must be created before uploading episodes")
        }

        const draft = episodesRef.current.find((ep) => ep.id === episodeId)
        if (!draft) return

        abortMapRef.current.get(episodeId)?.abort()
        const abort = new AbortController()
        abortMapRef.current.set(episodeId, abort)

        if (file.size > MAX_EPISODE_FILE_BYTES) {
          dispatch({
            type: "UPDATE_EPISODE",
            payload: {
              id: episodeId,
              patch: {
                media: {
                  file,
                  status: "failed",
                  progress: 0,
                  error: "File exceeds the 500MB limit",
                },
              },
            },
          })
          return
        }

        const asset = await probeAndCreateMediaAsset(file)
        if (abort.signal.aborted) return

        if (
          asset.durationSeconds != null &&
          asset.durationSeconds > MAX_VIDEO_DURATION_SECONDS
        ) {
          dispatch({
            type: "UPDATE_EPISODE",
            payload: {
              id: episodeId,
              patch: {
                media: {
                  ...asset,
                  status: "failed",
                  progress: 0,
                  error: "Video exceeds the 5 minute duration limit",
                },
                duration: formatMediaDuration(asset.durationSeconds),
              },
            },
          })
          return
        }

        dispatch({
          type: "UPDATE_EPISODE",
          payload: {
            id: episodeId,
            patch: {
              media: { ...asset, status: "converting", progress: 0 },
              duration: formatMediaDuration(asset.durationSeconds ?? null),
            },
          },
        })

        try {
          let backendEpisodeId = draft.backendEpisodeId
          if (!backendEpisodeId) {
            const created = await createEpisode(seriesId, {
              title: draft.title.trim() || "Untitled episode",
              synopsis: draft.synopsis.trim() || undefined,
              accessType: mapEpisodeAccess(draft.access),
              aiVerticalConversion: state.aiConversionEnabled,
            })
            backendEpisodeId = created.id
            dispatch({
              type: "UPDATE_EPISODE",
              payload: {
                id: episodeId,
                patch: { backendEpisodeId },
              },
            })
          }

          if (abort.signal.aborted) return

          const converted = await convertForUpload(file, {
            aiVerticalConversion: state.aiConversionEnabled,
            signal: abort.signal,
            onProgress: (update) => {
              if (update.phase === "converting") {
                dispatch({
                  type: "UPDATE_EPISODE",
                  payload: {
                    id: episodeId,
                    patch: {
                      media: {
                        file,
                        status: "converting",
                        progress: update.value,
                        durationSeconds: asset.durationSeconds,
                        previewObjectUrl: asset.previewObjectUrl,
                      },
                    },
                  },
                })
              }
            },
          })

          if (
            converted.durationSeconds != null &&
            converted.durationSeconds > MAX_VIDEO_DURATION_SECONDS
          ) {
            throw new Error("Video exceeds the 5 minute duration limit")
          }

          if (abort.signal.aborted) return

          dispatch({
            type: "UPDATE_EPISODE",
            payload: {
              id: episodeId,
              patch: {
                media: {
                  file,
                  status: "uploading",
                  progress: 0,
                  durationSeconds:
                    converted.durationSeconds ?? asset.durationSeconds,
                  previewObjectUrl: asset.previewObjectUrl,
                  episodeId: backendEpisodeId,
                },
              },
            },
          })

          let videoId: string | undefined
          const maxUploadAttempts = 3

          for (let attempt = 0; attempt < maxUploadAttempts; attempt += 1) {
            const uploadTarget = await getEpisodeUploadUrl(
              seriesId,
              backendEpisodeId
            )
            videoId = uploadTarget.videoId

            dispatch({
              type: "UPDATE_EPISODE",
              payload: {
                id: episodeId,
                patch: {
                  media: {
                    file,
                    status: "uploading",
                    progress: 0,
                    durationSeconds:
                      converted.durationSeconds ?? asset.durationSeconds,
                    previewObjectUrl: asset.previewObjectUrl,
                    episodeId: backendEpisodeId,
                    videoHostingId: videoId,
                  },
                },
              },
            })

            try {
              await uploadToCloudflareStream(
                uploadTarget.uploadUrl,
                converted.blob,
                (progress) => {
                  dispatch({
                    type: "UPDATE_EPISODE",
                    payload: {
                      id: episodeId,
                      patch: {
                        media: {
                          file,
                          status: "uploading",
                          progress,
                          durationSeconds:
                            converted.durationSeconds ?? asset.durationSeconds,
                          previewObjectUrl: asset.previewObjectUrl,
                          episodeId: backendEpisodeId,
                          videoHostingId: videoId,
                        },
                      },
                    },
                  })
                },
                converted.fileName
              )
              break
            } catch (error) {
              const canRetry =
                isUploadUrlExpiredError(error) &&
                attempt < maxUploadAttempts - 1 &&
                !abort.signal.aborted
              if (!canRetry) throw error
            }
          }

          if (abort.signal.aborted || !videoId) return

          dispatch({
            type: "UPDATE_EPISODE",
            payload: {
              id: episodeId,
              patch: {
                media: {
                  file,
                  status: "processing",
                  progress: 1,
                  durationSeconds:
                    converted.durationSeconds ?? asset.durationSeconds,
                  previewObjectUrl: asset.previewObjectUrl,
                  episodeId: backendEpisodeId,
                  videoHostingId: videoId,
                },
              },
            },
          })

          const readyEpisode = await waitForEpisodeStatus(
            seriesId,
            backendEpisodeId,
            "ready",
            { timeoutMs: 600_000 }
          )

          if (abort.signal.aborted) return

          dispatch({
            type: "UPDATE_EPISODE",
            payload: {
              id: episodeId,
              patch: {
                media: {
                  file,
                  status: "ready",
                  progress: 1,
                  durationSeconds:
                    converted.durationSeconds ?? asset.durationSeconds,
                  previewObjectUrl: asset.previewObjectUrl,
                  episodeId: backendEpisodeId,
                  videoHostingId: videoId,
                  hlsUrl: readyEpisode.hlsUrl ?? undefined,
                },
                duration: formatMediaDuration(
                  converted.durationSeconds ?? asset.durationSeconds ?? null
                ),
              },
            },
          })
        } catch (error) {
          if (abort.signal.aborted) return
          const message =
            error instanceof Error ? error.message : "Episode upload failed"
          dispatch({
            type: "UPDATE_EPISODE",
            payload: {
              id: episodeId,
              patch: {
                media: {
                  file,
                  status: "failed",
                  progress: 0,
                  error: message,
                  durationSeconds: asset.durationSeconds,
                  previewObjectUrl: asset.previewObjectUrl,
                },
              },
            },
          })
        }
      })
    },
    [dispatch, state.aiConversionEnabled]
  )

  const clearEpisode = useCallback(
    (episodeId: string) => {
      abortMapRef.current.get(episodeId)?.abort()
      abortMapRef.current.delete(episodeId)
      dispatch({
        type: "UPDATE_EPISODE",
        payload: {
          id: episodeId,
          patch: { media: null, duration: "0:00" },
        },
      })
    },
    [dispatch]
  )

  return { uploadEpisode, clearEpisode }
}
