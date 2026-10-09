import type { UpdatePlatformSettingsRequest } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { brandingKeys as publicBrandingKeys } from "@/features/branding/use-branding"
import {
  getBrandingSettings,
  updateBrandingSettings,
  uploadBrandingAsset,
} from "./branding-settings-api"

export const brandingSettingsKeys = {
  all: ["admin-branding-settings"] as const,
}

export function useBrandingSettingsQuery() {
  return useQuery({
    queryKey: brandingSettingsKeys.all,
    queryFn: getBrandingSettings,
  })
}

export function useUpdateBrandingSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePlatformSettingsRequest) =>
      updateBrandingSettings(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingSettingsKeys.all })
      // The public /platform/branding response also changed — refresh the
      // live-reskinned colors/logo for whoever's viewing this admin session.
      queryClient.invalidateQueries({ queryKey: publicBrandingKeys.all })
    },
  })
}

export function useUploadBrandingAsset() {
  return useMutation({
    mutationFn: ({
      assetType,
      file,
    }: {
      assetType: "logo" | "share-image"
      file: File
    }) => uploadBrandingAsset(assetType, file),
  })
}
