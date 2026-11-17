import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import {
  findEpisodeJob,
  findTrailerJob,
} from "@/features/uploads/upload-runner"
import { type UploadJob, useUploadJobs } from "@/features/uploads/upload-store"
import { PROJECT_THUMBNAILS } from "../constants"
import { formatDuration } from "../lib/media/format-duration"
import type {
  MediaJobStatus,
  PersonEntry,
  UploadEpisodeDraft,
  UploadMediaAsset,
  UploadWizardAction,
  UploadWizardState,
} from "../types"

function createPersonId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function createInitialEpisode(index: number): UploadEpisodeDraft {
  return {
    id: `ep-${Date.now()}-${index}`,
    title: `Episode ${index}`,
    synopsis: "",
    duration: "0:00",
    access: "free",
    autoCaption: true,
    media: null,
  }
}

const initialEpisodes: UploadEpisodeDraft[] = [createInitialEpisode(1)]

const initialState: UploadWizardState = {
  step: "info",
  seriesId: null,
  projectType: "short-series",
  title: "",
  genres: [],
  language: "English",
  synopsis: "",
  tags: "",
  access: "free",
  aiConversionEnabled: true,
  autoCaptionEnabled: true,
  subtitleTracks: ["English"],
  cast: [{ id: "cast-1", name: "", role: "" }],
  crew: [{ id: "crew-1", name: "", role: "Director" }],
  guideVisible: true,
  episodes: initialEpisodes,
  trailer: null,
  trailerUrl: null,
  poster: null,
  publishError: null,
  isPublishing: false,
  isContinuing: false,
  continueError: null,
}

function createEpisode(index: number): UploadEpisodeDraft {
  return {
    id: `ep-new-${Date.now()}-${index}`,
    title: `Episode ${index}`,
    synopsis: "",
    duration: "0:00",
    access: "free",
    autoCaption: true,
    media: null,
  }
}

function updatePersonList(
  list: PersonEntry[],
  id: string,
  patch: Partial<PersonEntry>
) {
  return list.map((person) =>
    person.id === id ? { ...person, ...patch } : person
  )
}

function uploadWizardReducer(
  state: UploadWizardState,
  action: UploadWizardAction
): UploadWizardState {
  switch (action.type) {
    case "SET_STEP": {
      if (action.payload !== "review") {
        return { ...state, step: action.payload }
      }
      const kept = state.episodes.filter(
        (episode) => episode.backendEpisodeId || episode.media != null
      )
      return {
        ...state,
        step: "review",
        episodes: kept.length > 0 ? kept : state.episodes,
      }
    }
    case "SET_FIELD":
      return { ...state, ...action.payload }
    case "TOGGLE_GENRE": {
      const genre = action.payload
      if (state.genres.includes(genre)) {
        return {
          ...state,
          genres: state.genres.filter((item) => item !== genre),
        }
      }
      if (state.genres.length >= 3) return state
      return { ...state, genres: [...state.genres, genre] }
    }
    case "TOGGLE_SUBTITLE": {
      const track = action.payload
      if (state.subtitleTracks.includes(track)) {
        return {
          ...state,
          subtitleTracks: state.subtitleTracks.filter((item) => item !== track),
        }
      }
      return { ...state, subtitleTracks: [...state.subtitleTracks, track] }
    }
    case "UPDATE_PERSON": {
      const { list, id, patch } = action.payload
      return {
        ...state,
        [list]: updatePersonList(state[list], id, patch),
      }
    }
    case "ADD_PERSON": {
      const list = action.payload
      const entry: PersonEntry = {
        id: createPersonId(list),
        name: "",
        role: list === "crew" ? "Director" : "",
      }
      return { ...state, [list]: [...state[list], entry] }
    }
    case "REMOVE_PERSON": {
      const { list, id } = action.payload
      if (state[list].length <= 1) return state
      return {
        ...state,
        [list]: state[list].filter((person) => person.id !== id),
      }
    }
    case "ADD_EPISODES":
      return {
        ...state,
        episodes: [
          ...state.episodes,
          ...Array.from({ length: action.payload }, (_, i) =>
            createEpisode(state.episodes.length + i + 1)
          ),
        ],
      }
    case "UPDATE_EPISODE": {
      return {
        ...state,
        episodes: state.episodes.map((ep) =>
          ep.id === action.payload.id ? { ...ep, ...action.payload.patch } : ep
        ),
      }
    }
    case "REMOVE_EPISODE":
      return {
        ...state,
        episodes: state.episodes.filter((ep) => ep.id !== action.payload.id),
      }
    case "PRUNE_EMPTY_EPISODES": {
      const kept = state.episodes.filter(
        (episode) => episode.backendEpisodeId || episode.media != null
      )
      return kept.length === state.episodes.length
        ? state
        : { ...state, episodes: kept }
    }
    case "TOGGLE_GUIDE":
      return { ...state, guideVisible: !state.guideVisible }
    case "SET_TRAILER":
      return { ...state, trailer: action.payload }
    case "UPDATE_TRAILER":
      if (!state.trailer) return state
      return { ...state, trailer: { ...state.trailer, ...action.payload } }
    case "SET_POSTER":
      return { ...state, poster: action.payload }
    case "UPDATE_POSTER":
      if (!state.poster) return state
      return { ...state, poster: { ...state.poster, ...action.payload } }
    case "SET_TRAILER_URL":
      return { ...state, trailerUrl: action.payload }
    case "SET_SERIES_ID":
      return { ...state, seriesId: action.payload }
    case "RESET":
      return {
        ...initialState,
        episodes: [createInitialEpisode(1)],
      }
    default:
      return state
  }
}

interface UploadWizardContextValue {
  state: UploadWizardState
  dispatch: Dispatch<UploadWizardAction>
  wizardId: string
  previewImage: string
}

const UploadWizardContext = createContext<UploadWizardContextValue | null>(null)

function jobStatus(job: UploadJob): MediaJobStatus {
  return job.phase === "interrupted" ? "failed" : job.phase
}

function jobError(job: UploadJob) {
  if (job.phase === "interrupted") {
    return "Upload stopped when the page closed. Choose the file again to continue."
  }
  return job.phase === "failed" ? job.error : undefined
}

function mediaFromJob(
  job: UploadJob,
  current: UploadMediaAsset | null
): UploadMediaAsset {
  return {
    file: current?.file ?? new File([], job.fileName),
    status: jobStatus(job),
    progress: job.phase === "ready" ? 1 : job.progress,
    error: jobError(job),
    durationSeconds: job.durationSeconds ?? current?.durationSeconds,
    previewObjectUrl: current?.previewObjectUrl ?? job.previewObjectUrl,
    episodeId: job.episodeId ?? current?.episodeId,
    videoHostingId: job.videoId ?? current?.videoHostingId,
    hlsUrl: job.hlsUrl ?? current?.hlsUrl,
  }
}

function mediaChanged(
  current: UploadMediaAsset | null,
  next: UploadMediaAsset
) {
  return (
    !current ||
    current.status !== next.status ||
    current.progress !== next.progress ||
    current.error !== next.error ||
    current.videoHostingId !== next.videoHostingId ||
    current.hlsUrl !== next.hlsUrl ||
    current.durationSeconds !== next.durationSeconds
  )
}

/**
 * Mirrors the app-wide upload jobs into the wizard, so episode cards show
 * live progress — including for uploads started before the creator left and
 * came back to this page.
 */
function useSyncUploadJobs(
  state: UploadWizardState,
  dispatch: Dispatch<UploadWizardAction>,
  wizardId: string
) {
  const jobs = useUploadJobs()

  useEffect(() => {
    for (const episode of state.episodes) {
      const job = findEpisodeJob(jobs, {
        episodeId: episode.backendEpisodeId,
        draftId: episode.id,
      })
      if (!job) continue
      const media = mediaFromJob(job, episode.media)
      if (!mediaChanged(episode.media, media)) continue
      dispatch({
        type: "UPDATE_EPISODE",
        payload: {
          id: episode.id,
          patch: {
            media,
            ...(job.durationSeconds != null && {
              duration: formatDuration(job.durationSeconds),
            }),
          },
        },
      })
    }

    const trailerJob = findTrailerJob(jobs, {
      seriesId: state.seriesId,
      wizardId,
    })
    if (trailerJob) {
      const media = mediaFromJob(trailerJob, state.trailer)
      if (mediaChanged(state.trailer, media)) {
        dispatch({ type: "SET_TRAILER", payload: media })
      }
      if (trailerJob.hlsUrl && state.trailerUrl !== trailerJob.hlsUrl) {
        dispatch({ type: "SET_TRAILER_URL", payload: trailerJob.hlsUrl })
      }
    }
  }, [
    jobs,
    state.episodes,
    state.trailer,
    state.trailerUrl,
    state.seriesId,
    dispatch,
    wizardId,
  ])
}

export function UploadWizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uploadWizardReducer, initialState)
  // Identifies this wizard's trailer upload before the series exists.
  const [wizardId] = useState(
    () =>
      `wizard-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  )
  useSyncUploadJobs(state, dispatch, wizardId)
  const value = useMemo(
    () => ({
      state,
      dispatch,
      wizardId,
      previewImage:
        state.poster?.remoteUrl ??
        state.poster?.previewObjectUrl ??
        PROJECT_THUMBNAILS.theReturnees,
    }),
    [state, wizardId]
  )

  return (
    <UploadWizardContext.Provider value={value}>
      {children}
    </UploadWizardContext.Provider>
  )
}

export function useUploadWizard() {
  const ctx = useContext(UploadWizardContext)
  if (!ctx) {
    throw new Error("useUploadWizard must be used within UploadWizardProvider")
  }
  return ctx
}
