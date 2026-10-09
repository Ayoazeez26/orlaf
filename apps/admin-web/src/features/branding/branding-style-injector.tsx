import { useLayoutEffect } from "react"
import { applyBrandingColors, writeCachedBranding } from "@/lib/branding"
import { useBranding } from "./use-branding"

/**
 * Applies platform branding colors to the document root and refreshes the
 * local cache. Renders nothing — the flash-free application on repeat
 * visits happens via the inline head script in __root.tsx; this keeps the
 * cache warm and re-applies if an admin changed branding since it was
 * written.
 */
export function BrandingStyleInjector() {
  const branding = useBranding()

  useLayoutEffect(() => {
    applyBrandingColors(branding)
    writeCachedBranding(branding)
  }, [branding])

  return null
}
