import type { ApplicationDetail, ChecklistStep } from "../types"
import { MOCK_APPLICATIONS } from "./mock-onboarding"

const DEFAULT_CHECKLIST: ChecklistStep[] = [
  { id: "submitted", label: "Application submitted", completed: true },
  { id: "invite", label: "Invite email sent", completed: false },
  { id: "identity", label: "Identity verified", completed: false },
  { id: "payout", label: "Payout details collected", completed: false },
  { id: "active", label: "Creator account active", completed: false },
]

const APPROVED_CHECKLIST: ChecklistStep[] = [
  { id: "submitted", label: "Application submitted", completed: true },
  { id: "invite", label: "Invite email sent", completed: true },
  { id: "identity", label: "Identity verified", completed: true },
  { id: "payout", label: "Payout details collected", completed: true },
  { id: "active", label: "Creator account active", completed: true },
]

const DETAIL_OVERRIDES: Partial<
  Record<string, Pick<ApplicationDetail, "bio" | "checklist">>
> = {
  "tunde-bakare": {
    bio: "Vertical drama director, 5 years in short-form storytelling.",
    checklist: DEFAULT_CHECKLIST,
  },
  "amaka-eze": {
    bio: "Documentary filmmaker focused on West African urban stories.",
    checklist: APPROVED_CHECKLIST,
  },
  "raj-patel": {
    bio: "Experimental short-form creator with a focus on thriller content.",
    checklist: [
      { id: "submitted", label: "Application submitted", completed: true },
      { id: "invite", label: "Invite email sent", completed: false },
      { id: "identity", label: "Identity verified", completed: false },
      { id: "payout", label: "Payout details collected", completed: false },
      { id: "active", label: "Creator account active", completed: false },
    ],
  },
}

function buildDetail(
  application: (typeof MOCK_APPLICATIONS)[number]
): ApplicationDetail {
  const override: Partial<Pick<ApplicationDetail, "bio" | "checklist">> =
    DETAIL_OVERRIDES[application.id] ?? {}

  return {
    ...application,
    bio:
      override.bio ??
      `${application.name} is an aspiring creator based in ${application.location}.`,
    checklist: override.checklist ?? DEFAULT_CHECKLIST,
  }
}

export function getApplicationDetail(
  id: string
): ApplicationDetail | undefined {
  const application = MOCK_APPLICATIONS.find((a) => a.id === id)
  return application ? buildDetail(application) : undefined
}
