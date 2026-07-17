import type { OnboardingStatusResponse } from "@sable/contracts"
import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import { fromApiProfile } from "./lib/onboarding-mappers"
import {
  type AuthMethod,
  type CreatorType,
  type GetStartedMode,
  initialOnboardingData,
  type OnboardingData,
  type OnboardingProfile,
  type OnboardingStudio,
  type TeamSize,
} from "./types"

/**
 * Onboarding selections are mirrored to sessionStorage so an accidental reload,
 * tab discard, or a transient session drop (which wipes the in-memory access
 * token) never discards the user's progress. Only non-sensitive selection
 * fields are persisted — never credentials or verification codes.
 */
const STORAGE_KEY = "orlaf.onboarding.progress.v1"

type PersistedOnboarding = Pick<
  OnboardingData,
  "creatorType" | "studio" | "contentFormats" | "getStartedMode"
>

function readPersisted(): Partial<OnboardingData> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as PersistedOnboarding
    return {
      creatorType: parsed.creatorType ?? null,
      studio: parsed.studio ?? initialOnboardingData.studio,
      contentFormats: Array.isArray(parsed.contentFormats)
        ? parsed.contentFormats
        : [],
      getStartedMode: parsed.getStartedMode ?? null,
    }
  } catch {
    return {}
  }
}

function writePersisted(data: OnboardingData) {
  if (typeof window === "undefined") return
  try {
    const subset: PersistedOnboarding = {
      creatorType: data.creatorType,
      studio: data.studio,
      contentFormats: data.contentFormats,
      getStartedMode: data.getStartedMode,
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(subset))
  } catch {
    // sessionStorage may be unavailable (private mode / quota) — non-fatal.
  }
}

/** Clears persisted onboarding progress (call on completion and sign-out). */
export function clearOnboardingProgress() {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // non-fatal
  }
}

type OnboardingAction =
  | { type: "SET_AUTH_METHOD"; payload: AuthMethod }
  | { type: "SET_PROFILE"; payload: Partial<OnboardingProfile> }
  | {
      type: "SET_VERIFICATION_META"
      payload: { verificationId: string; maskedEmail: string }
    }
  | { type: "SET_VERIFICATION_CODE"; payload: string }
  | { type: "SET_CREATOR_TYPE"; payload: CreatorType }
  | { type: "SET_STUDIO"; payload: Partial<OnboardingStudio> }
  | { type: "SET_TEAM_SIZE"; payload: TeamSize }
  | { type: "TOGGLE_CONTENT_FORMAT"; payload: string }
  | { type: "SET_GET_STARTED_MODE"; payload: GetStartedMode }
  | { type: "HYDRATE_FROM_API"; payload: OnboardingStatusResponse }
  | { type: "RESET" }

function onboardingReducer(
  state: OnboardingData,
  action: OnboardingAction
): OnboardingData {
  switch (action.type) {
    case "SET_AUTH_METHOD":
      return { ...state, authMethod: action.payload }
    case "SET_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.payload } }
    case "SET_VERIFICATION_META":
      return {
        ...state,
        verificationId: action.payload.verificationId,
        maskedEmail: action.payload.maskedEmail,
      }
    case "SET_VERIFICATION_CODE":
      return { ...state, verificationCode: action.payload }
    case "SET_CREATOR_TYPE":
      return { ...state, creatorType: action.payload }
    case "SET_STUDIO":
      return { ...state, studio: { ...state.studio, ...action.payload } }
    case "SET_TEAM_SIZE":
      return {
        ...state,
        studio: { ...state.studio, teamSize: action.payload },
      }
    case "TOGGLE_CONTENT_FORMAT": {
      const id = action.payload
      const exists = state.contentFormats.includes(id)
      return {
        ...state,
        contentFormats: exists
          ? state.contentFormats.filter((f) => f !== id)
          : [...state.contentFormats, id],
      }
    }
    case "SET_GET_STARTED_MODE":
      return { ...state, getStartedMode: action.payload }
    case "HYDRATE_FROM_API":
      return { ...state, ...fromApiProfile(action.payload.profile) }
    case "RESET":
      return initialOnboardingData
    default:
      return state
  }
}

interface OnboardingContextValue {
  data: OnboardingData
  dispatch: Dispatch<OnboardingAction>
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(
    onboardingReducer,
    initialOnboardingData,
    (init) => ({ ...init, ...readPersisted() })
  )

  useEffect(() => {
    writePersisted(data)
  }, [data])

  const value = useMemo(() => ({ data, dispatch }), [data])

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider")
  }
  return context
}
