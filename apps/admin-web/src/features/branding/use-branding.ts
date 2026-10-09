import type { PublicBrandingSettings } from "@sable/contracts"
import { useQuery } from "@tanstack/react-query"
import { fetchBranding, readCachedBranding } from "@/lib/branding"

export const brandingKeys = {
  all: ["branding"] as const,
}

/** Cached value shows immediately; a background fetch keeps it fresh for next load. */
export function useBranding(): PublicBrandingSettings {
  const { data } = useQuery({
    queryKey: brandingKeys.all,
    queryFn: fetchBranding,
    initialData: readCachedBranding,
    staleTime: 60_000,
  })
  return data
}
