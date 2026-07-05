import type { CreatorPreferences } from "@sable/contracts"
import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"
import { usePreferences } from "./use-preferences"

export function applyCreatorPreferences(
  prefs: Pick<CreatorPreferences, "reducedMotion">
) {
  if (typeof document !== "undefined") {
    document.documentElement.toggleAttribute(
      "data-reduced-motion",
      prefs.reducedMotion
    )
  }
}

export function applyDisplayPreferences(
  prefs: Pick<CreatorPreferences, "colorScheme" | "reducedMotion">,
  setTheme: (theme: string) => void
) {
  setTheme(prefs.colorScheme)
  applyCreatorPreferences(prefs)
}

export function useApplyCreatorPreferences() {
  const { data } = usePreferences()
  const { setTheme } = useTheme()
  const appliedUpdatedAtRef = useRef<string | null>(null)

  useEffect(() => {
    if (!data) return
    // Only apply when saved preferences change — avoids clobbering live
    // theme previews on the Preferences page before the user clicks Save.
    if (appliedUpdatedAtRef.current === data.updatedAt) return
    appliedUpdatedAtRef.current = data.updatedAt
    applyDisplayPreferences(data, setTheme)
  }, [data, setTheme])
}
