import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react"
import { PROJECT_THUMBNAILS } from "../constants"
import { DEFAULT_UPLOAD_EPISODES } from "../data/mock-projects"
import type {
  UploadEpisodeDraft,
  UploadWizardAction,
  UploadWizardState,
} from "../types"

const initialState: UploadWizardState = {
  step: "info",
  title: "",
  genre: "",
  language: "English",
  synopsis: "",
  tags: "",
  guideVisible: true,
  episodes: DEFAULT_UPLOAD_EPISODES.map((ep) => ({ ...ep })),
}

function createEpisode(index: number): UploadEpisodeDraft {
  return {
    id: `ep-new-${Date.now()}-${index}`,
    title: `Episode ${index}`,
    synopsis: "",
    duration: "0:00",
    access: "coins",
    autoCaption: true,
  }
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
    case "TOGGLE_GUIDE":
      return { ...state, guideVisible: !state.guideVisible }
    case "RESET":
      return {
        ...initialState,
        episodes: DEFAULT_UPLOAD_EPISODES.map((ep) => ({ ...ep })),
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
      previewImage: PROJECT_THUMBNAILS.theReturnees,
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
