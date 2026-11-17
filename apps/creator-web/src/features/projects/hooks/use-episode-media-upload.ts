import { useCallback, useRef } from "react"
import {
  cancelUpload,
  findEpisodeJob,
  startEpisodeUpload,
} from "@/features/uploads/upload-runner"
import { getJobs } from "@/features/uploads/upload-store"
import { createEpisode } from "../api/studio-api"
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

/**
 * The most recent file pick per episode draft. Checking a file takes a moment;
 * if the creator picks another file or removes it meanwhile, the stale pick
 * must not start an upload.
 */
const latestPick = new Map<string, symbol>()

/**
 * In-flight backend episode creation per draft, so two quick picks on a new
 * draft create one episode, not two.
 */
const creatingEpisode = new Map<string, Promise<string>>()

/**
 * Validates an episode file and hands it to the app-wide upload runner. The
 * upload continues in the background (and shows in the upload tray) even if
 * the creator moves on to another episode, another step, or another page.
 */
export function useEpisodeMediaUpload() {
  const { state, dispatch } = useUploadWizard()
  const seriesIdRef = useRef(state.seriesId)
  const episodesRef = useRef(state.episodes)
  seriesIdRef.current = state.seriesId
  episodesRef.current = state.episodes

  const failEpisode = useCallback(
    (
      episodeId: string,
      file: File,
      error: string,
      extra: { durationSeconds?: number; previewObjectUrl?: string } = {}
    ) => {
      dispatch({
        type: "UPDATE_EPISODE",
        payload: {
          id: episodeId,
          patch: {
            media: { file, status: "failed", progress: 0, error, ...extra },
          },
        },
      })
    },
    [dispatch]
  )

  const uploadEpisode = useCallback(
    async (episodeId: string, file: File) => {
      const draft = episodesRef.current.find((ep) => ep.id === episodeId)
      if (!draft) return

      const seriesId = seriesIdRef.current
      if (!seriesId) {
        failEpisode(
          episodeId,
          file,
          "This series hasn't been saved yet. Go back to Series Info and click Continue."
        )
        return
      }

      // Drop any earlier upload for this episode first; otherwise its state
      // (say, a failure) would be mirrored back over the new file.
      const previousJob = findEpisodeJob(getJobs(), {
        episodeId: draft.backendEpisodeId,
        draftId: episodeId,
      })
      if (previousJob) cancelUpload(previousJob.id)

      const pick = Symbol(file.name)
      latestPick.set(episodeId, pick)
      const isStale = () => latestPick.get(episodeId) !== pick

      dispatch({
        type: "UPDATE_EPISODE",
        payload: {
          id: episodeId,
          patch: { media: { file, status: "probing", progress: 0 } },
        },
      })

      let asset: Awaited<ReturnType<typeof probeAndCreateMediaAsset>>
      try {
        asset = await probeAndCreateMediaAsset(file)
      } catch (error) {
        if (isStale()) return
        failEpisode(
          episodeId,
          file,
          error instanceof Error ? error.message : "This file couldn't be read"
        )
        return
      }
      if (isStale()) return

      dispatch({
        type: "UPDATE_EPISODE",
        payload: {
          id: episodeId,
          patch: {
            media: { ...asset, status: "queued", progress: 0 },
            duration: formatMediaDuration(asset.durationSeconds ?? null),
          },
        },
      })

      try {
        let backendEpisodeId =
          episodesRef.current.find((ep) => ep.id === episodeId)
            ?.backendEpisodeId ?? draft.backendEpisodeId
        if (!backendEpisodeId) {
          let creation = creatingEpisode.get(episodeId)
          if (!creation) {
            creation = createEpisode(seriesId, {
              title: draft.title.trim() || "Untitled episode",
              synopsis: draft.synopsis.trim() || undefined,
              accessType: mapEpisodeAccess(draft.access),
              ...(draft.access === "coins" && draft.coinPrice != null
                ? { coinPrice: draft.coinPrice }
                : {}),
              aiVerticalConversion: state.aiConversionEnabled,
            }).then((created) => created.id)
            creatingEpisode.set(episodeId, creation)
            const createdId = await creation.finally(() =>
              creatingEpisode.delete(episodeId)
            )
            dispatch({
              type: "UPDATE_EPISODE",
              payload: {
                id: episodeId,
                patch: { backendEpisodeId: createdId },
              },
            })
          }
          backendEpisodeId = await creation
        }
        if (isStale()) return

        const title = draft.title.trim() || "Untitled episode"
        startEpisodeUpload({
          seriesId,
          episodeId: backendEpisodeId,
          draftId: episodeId,
          title: state.title.trim()
            ? `${state.title.trim()} · ${title}`
            : title,
          file,
          aiVerticalConversion: state.aiConversionEnabled,
          previewObjectUrl: asset.previewObjectUrl,
          durationSeconds: asset.durationSeconds,
        })
      } catch (error) {
        if (isStale()) return
        failEpisode(
          episodeId,
          file,
          error instanceof Error ? error.message : "Episode upload failed",
          asset
        )
      }
    },
    [dispatch, failEpisode, state.aiConversionEnabled, state.title]
  )

  const clearEpisode = useCallback(
    (episodeId: string) => {
      latestPick.delete(episodeId)
      const draft = episodesRef.current.find((ep) => ep.id === episodeId)
      const job = findEpisodeJob(getJobs(), {
        episodeId: draft?.backendEpisodeId,
        draftId: episodeId,
      })
      if (job) cancelUpload(job.id)
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
