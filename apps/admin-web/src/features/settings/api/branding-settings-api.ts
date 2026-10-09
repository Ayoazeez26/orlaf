import type {
  BrandingAssetUploadUrlRequest,
  BrandingAssetUploadUrlResponse,
  PlatformSettings,
  UpdatePlatformSettingsRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

const BASE = "/api/v1/admin/settings/branding"

export function getBrandingSettings(): Promise<PlatformSettings> {
  return apiRequest<PlatformSettings>(BASE)
}

export function updateBrandingSettings(
  body: UpdatePlatformSettingsRequest
): Promise<PlatformSettings> {
  return apiRequest<PlatformSettings>(BASE, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function getBrandingAssetUploadUrl(
  body: BrandingAssetUploadUrlRequest
): Promise<BrandingAssetUploadUrlResponse> {
  return apiRequest<BrandingAssetUploadUrlResponse>(`${BASE}/upload-url`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function uploadBrandingAsset(
  assetType: "logo" | "share-image",
  file: File
): Promise<string> {
  const { uploadUrl, imageUrl } = await getBrandingAssetUploadUrl({
    assetType,
    contentType: file.type,
  })

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  })
  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`)
  }

  return imageUrl
}
