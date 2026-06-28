import type {
  ProfileImageUploadUrlResponse,
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdateSocialLinksRequest,
  UpdateSocialLinksResponse,
  UpdateStudioRequest,
  UpdateStudioResponse,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

function profilePath(path: string) {
  return `/api/v1/profile${path}`
}

export async function fetchProfile(): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>(profilePath("/me"))
}

export async function updateProfile(
  body: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  return apiRequest<UpdateProfileResponse>(profilePath("/me"), {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function updateSocialLinks(
  body: UpdateSocialLinksRequest
): Promise<UpdateSocialLinksResponse> {
  return apiRequest<UpdateSocialLinksResponse>(profilePath("/me/social"), {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function getAvatarUploadUrl(
  contentType: string
): Promise<ProfileImageUploadUrlResponse> {
  return apiRequest<ProfileImageUploadUrlResponse>(
    profilePath("/me/avatar-url"),
    {
      method: "POST",
      body: JSON.stringify({ contentType }),
    }
  )
}

export async function updateStudio(
  body: UpdateStudioRequest
): Promise<UpdateStudioResponse> {
  return apiRequest<UpdateStudioResponse>(profilePath("/studio"), {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function getLogoUploadUrl(
  contentType: string
): Promise<ProfileImageUploadUrlResponse> {
  return apiRequest<ProfileImageUploadUrlResponse>(
    profilePath("/studio/logo-url"),
    {
      method: "POST",
      body: JSON.stringify({ contentType }),
    }
  )
}
