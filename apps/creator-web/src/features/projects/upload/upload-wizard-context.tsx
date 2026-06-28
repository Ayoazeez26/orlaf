import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react"
import { PROJECT_THUMBNAILS } from "../constants"
import type {
  PersonEntry,
  UploadEpisodeDraft,
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
    access: "coins",
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
    access: "coins",
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
    case "SET_STEP":
      return { ...state, step: action.payload }
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
  previewImage: string
}

const UploadWizardContext = createContext<UploadWizardContextValue | null>(null)

export function UploadWizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uploadWizardReducer, initialState)
  const value = useMemo(
    () => ({
      state,
      dispatch,
      previewImage:
        state.poster?.remoteUrl ??
        state.poster?.previewObjectUrl ??
        PROJECT_THUMBNAILS.theReturnees,
    }),
    [state]
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
