import type { PublicBrandingSettings } from "@sable/contracts"

const CACHE_KEY = "sable:branding"

export const DEFAULT_BRANDING: PublicBrandingSettings = {
  primaryColor: "#B67233",
  accentColor: "#FFD2A8",
  darkModeDefault: true,
  logoUrl: "",
  shareImageUrl: "",
}

/** Synchronous — used before first paint (ThemeProvider's defaultTheme, inline style injection) to avoid a flash of default branding on repeat visits. */
export function readCachedBranding(): PublicBrandingSettings {
  if (typeof window === "undefined") return DEFAULT_BRANDING
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return DEFAULT_BRANDING
    return { ...DEFAULT_BRANDING, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_BRANDING
  }
}

export function writeCachedBranding(branding: PublicBrandingSettings): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(branding))
  } catch {
    // Best effort — private browsing / storage full.
  }
}

export function applyBrandingColors(branding: PublicBrandingSettings): void {
  const root = document.documentElement
  root.style.setProperty("--primary", branding.primaryColor)
  root.style.setProperty("--sidebar-primary", branding.primaryColor)
  root.style.setProperty("--accent", branding.accentColor)
}

export async function fetchBranding(): Promise<PublicBrandingSettings> {
  const response = await fetch("/api/v1/platform/branding")
  if (!response.ok) throw new Error("Failed to load branding")
  return response.json()
}
