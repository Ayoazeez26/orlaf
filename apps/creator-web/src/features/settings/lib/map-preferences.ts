import type {
  ColorScheme,
  CreatorPreferences,
  DefaultVisibility,
  UpdateCreatorPreferencesRequest,
} from "@sable/contracts"
import {
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  VISIBILITY_OPTIONS,
} from "../constants"

export interface PreferencesFormState {
  defaultLanguage: string
  defaultVisibility: DefaultVisibility
  commentsEnabledByDefault: boolean
  autoPublishAfterProcessing: boolean
  tippingEnabledByDefault: boolean
  dashboardLanguage: string
  timezone: string
  colorScheme: ColorScheme
  reducedMotion: boolean
}

const visibilityLabelByValue = Object.fromEntries(
  VISIBILITY_OPTIONS.map((option) => [option.value, option.label])
) as Record<DefaultVisibility, string>

const visibilityValueByLabel = Object.fromEntries(
  VISIBILITY_OPTIONS.map((option) => [option.label, option.value])
) as Record<string, DefaultVisibility>

const timezoneLabelByValue = Object.fromEntries(
  TIMEZONE_OPTIONS.map((option) => [option.value, option.label])
)

const timezoneValueByLabel = Object.fromEntries(
  TIMEZONE_OPTIONS.map((option) => [option.label, option.value])
)

export function preferencesToForm(
  prefs: CreatorPreferences
): PreferencesFormState {
  return {
    defaultLanguage: prefs.defaultContentLanguage,
    defaultVisibility: prefs.defaultVisibility,
    commentsEnabledByDefault: prefs.commentsEnabledByDefault,
    autoPublishAfterProcessing: prefs.autoPublishAfterProcessing,
    tippingEnabledByDefault: prefs.tippingEnabledByDefault,
    dashboardLanguage: prefs.dashboardLanguage,
    timezone: prefs.timezone,
    colorScheme: prefs.colorScheme,
    reducedMotion: prefs.reducedMotion,
  }
}

export function formToPreferencesPatch(
  form: PreferencesFormState
): UpdateCreatorPreferencesRequest {
  return {
    defaultContentLanguage: form.defaultLanguage,
    defaultVisibility: form.defaultVisibility,
    commentsEnabledByDefault: form.commentsEnabledByDefault,
    autoPublishAfterProcessing: form.autoPublishAfterProcessing,
    tippingEnabledByDefault: form.tippingEnabledByDefault,
    dashboardLanguage: form.dashboardLanguage,
    timezone: form.timezone,
    colorScheme: form.colorScheme,
    reducedMotion: form.reducedMotion,
  }
}

export function visibilityLabel(value: DefaultVisibility) {
  return visibilityLabelByValue[value]
}

export function visibilityValue(label: string): DefaultVisibility {
  return visibilityValueByLabel[label] ?? "public"
}

export function timezoneLabel(value: string) {
  return timezoneLabelByValue[value] ?? value
}

export function timezoneValue(label: string) {
  return timezoneValueByLabel[label] ?? label
}

export const LANGUAGE_SELECT_OPTIONS = [...LANGUAGE_OPTIONS]

export const VISIBILITY_SELECT_OPTIONS = VISIBILITY_OPTIONS.map(
  (option) => option.label
)

export const TIMEZONE_SELECT_OPTIONS = TIMEZONE_OPTIONS.map(
  (option) => option.label
)
