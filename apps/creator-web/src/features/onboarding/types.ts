export type AuthMethod = "email" | "google" | "apple"

export type CreatorType = "solo" | "studio"

export type TeamSize = "1-5" | "6-15" | "16-50" | "50+"

export type GetStartedMode = "upload" | "create-series"

export type OnboardingStep =
  | "welcome"
  | "consent"
  | "signup"
  | "verify"
  | "creator-type"
  | "studio"
  | "content"
  | "get-started"

export interface OnboardingProfile {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface OnboardingStudio {
  name: string
  teamSize: TeamSize | null
  website: string
}

export interface OnboardingData {
  authMethod: AuthMethod | null
  profile: OnboardingProfile
  verificationId: string | null
  maskedEmail: string | null
  verificationCode: string
  creatorType: CreatorType | null
  studio: OnboardingStudio
  contentFormats: string[]
  getStartedMode: GetStartedMode | null
}

export const initialOnboardingData: OnboardingData = {
  authMethod: null,
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  verificationId: null,
  maskedEmail: null,
  verificationCode: "",
  creatorType: null,
  studio: {
    name: "",
    teamSize: null,
    website: "",
  },
  contentFormats: [],
  getStartedMode: null,
}

import type { LucideIcon } from "lucide-react"

export interface ContentFormatOption {
  id: string
  label: string
  icon: LucideIcon
}
