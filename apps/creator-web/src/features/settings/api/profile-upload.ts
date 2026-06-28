/**
 * Profile/studio image uploads — direct PUT to R2 via a signed URL.
 * Files never pass through the backend; only the signed URL is minted via profile-api.
 */

import {
  assertImageType,
  type UploadProgressCallback,
  uploadWithPut,
} from "@/features/projects/api/studio-upload"
import { getAvatarUploadUrl, getLogoUploadUrl } from "./profile-api"

export async function uploadAvatar(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<{ imageUrl: string }> {
  assertImageType(file)

  const { uploadUrl, imageUrl } = await getAvatarUploadUrl(file.type)
  await uploadWithPut(uploadUrl, file, file.type, onProgress)

  return { imageUrl }
}

export async function uploadStudioLogo(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<{ imageUrl: string }> {
  assertImageType(file)

  const { uploadUrl, imageUrl } = await getLogoUploadUrl(file.type)
  await uploadWithPut(uploadUrl, file, file.type, onProgress)

  return { imageUrl }
}
